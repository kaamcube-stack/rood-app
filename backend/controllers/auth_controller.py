from fastapi import APIRouter, HTTPException, status, Depends, Cookie, Response, Request
from fastapi.encoders import jsonable_encoder
from fastapi.security import HTTPBearer
from fastapi.responses import JSONResponse, HTMLResponse
from models.user import (
    UserCreate, UserLogin, UserResponse, Token,
    OTPRequest, OTPVerify, GoogleLogin, AppleLogin,
    AuthResponse
)
from services.auth_service import auth_service
from services.otp_service import msg91_service
from middleware.auth_middleware import get_current_user
from config.settings import settings
import jwt as pyjwt

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()


# ============ Email/Password Auth ============

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """
    Register a new user with email/password.
    """
    return await auth_service.register_user(user_data)


@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, response: Response, request: Request):
    """
    Authenticate user with email/password and return tokens.
    """
    tokens = await auth_service.login_user(login_data)
    
    # Set refresh token in cookie
    response.set_cookie(
        key="refresh_token",
        value=tokens.refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )
    
    return tokens


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: UserResponse = Depends(get_current_user)):
    """
    Get current authenticated user information.
    """
    return current_user


@router.post("/logout")
async def logout(response: Response, current_user: UserResponse = Depends(get_current_user)):
    """
    Logout user. Client should discard tokens.
    """
    response.delete_cookie("refresh_token")
    return {"message": "Successfully logged out"}


# ============ OTP Auth ============

@router.post("/otp/send")
async def send_otp(otp_request: OTPRequest):
    """
    Send OTP to mobile number via MSG91.
    Creates a new user if mobile doesn't exist.
    """
    success, message = await auth_service.send_otp(otp_request)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "message": "OTP sent successfully",
            "data": {"mobile": otp_request.mobile}
        }
    )


@router.post("/otp/verify")
async def verify_otp(otp_verify: OTPVerify, response: Response, request: Request):
    """
    Verify OTP and login user.
    """
    success, result = await auth_service.verify_otp_and_login(otp_verify)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("message", "Invalid OTP")
        )
    
    # Set refresh token in cookie
    tokens = result["tokens"]
    response.set_cookie(
        key="refresh_token",
        value=tokens.refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )
    
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder({
            "success": True,
            "message": "Login successful",
            "data": {
                "user": result["user"],
                "access_token": tokens.access_token,
                "token_type": tokens.token_type,
                "expires_in": tokens.expires_in
            }
        })
    )


# ============ Google Auth ============

@router.post("/google/login")
async def google_login(google_data: GoogleLogin, response: Response, request: Request):
    """
    Login or signup with Google OAuth.
    """
    success, result = await auth_service.google_login(google_data)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("message", "Google authentication failed")
        )
    
    # Set refresh token in cookie
    tokens = result["tokens"]
    response.set_cookie(
        key="refresh_token",
        value=tokens.refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )
    
    return JSONResponse(
        status_code=200 if not result.get("is_new_user") else 201,
        content=jsonable_encoder({
            "success": True,
            "message": "Login successful" if not result.get("is_new_user") else "User created successfully",
            "data": {
                "user": result["user"],
                "access_token": tokens.access_token,
                "token_type": tokens.token_type,
                "expires_in": tokens.expires_in
            }
        })
    )


# ============ Apple Auth ============

@router.post("/apple/login")
async def apple_login(apple_data: AppleLogin, response: Response, request: Request):
    """
    Login or signup with Apple Sign In.
    """
    success, result = await auth_service.apple_login(apple_data)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("message", "Apple authentication failed")
        )
    
    # Set refresh token in cookie
    tokens = result["tokens"]
    response.set_cookie(
        key="refresh_token",
        value=tokens.refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )
    
    return JSONResponse(
        status_code=200 if not result.get("is_new_user") else 201,
        content=jsonable_encoder({
            "success": True,
            "message": "Login successful" if not result.get("is_new_user") else "User created successfully",
            "data": {
                "user": result["user"],
                "access_token": tokens.access_token,
                "token_type": tokens.token_type,
                "expires_in": tokens.expires_in
            }
        })
    )


# ============ Token Refresh ============

@router.post("/refresh")
async def refresh_token(request: Request, refresh_token: str = Cookie(None)):
    """
    Refresh access token using refresh token from cookie.
    """
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing"
        )
    
    try:
        # Decode refresh token
        payload = pyjwt.decode(
            refresh_token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        # Generate new tokens
        tokens = await auth_service.refresh_access_token(user_id)
        
        return JSONResponse(
            status_code=200,
            content=jsonable_encoder({
                "success": True,
                "message": "Token refreshed successfully",
                "data": {
                    "access_token": tokens.access_token,
                    "token_type": tokens.token_type,
                    "expires_in": tokens.expires_in
                }
            })
        )
        
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token expired"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )


# ============ Test Routes ============

@router.get("/test/google", response_class=HTMLResponse)
async def test_google_login():
    """
    HTML test page for Google Sign-In.
    Open this in browser to test Google OAuth flow.
    """
    google_client_id = settings.GOOGLE_CLIENT_ID or "YOUR_GOOGLE_CLIENT_ID"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Test Google Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body {{
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                background: #f0f2f5;
            }}
            .container {{
                background: white;
                padding: 40px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 400px;
                width: 90%;
            }}
            h1 {{
                color: #333;
                margin-bottom: 10px;
            }}
            .subtitle {{
                color: #666;
                margin-bottom: 30px;
            }}
            .google-btn {{
                display: inline-flex;
                align-items: center;
                background: #fff;
                border: 1px solid #dadce0;
                border-radius: 4px;
                padding: 12px 24px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                color: #3c4043;
                transition: box-shadow 0.2s;
            }}
            .google-btn:hover {{
                box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
            }}
            .google-icon {{
                width: 18px;
                height: 18px;
                margin-right: 10px;
            }}
            #result {{
                margin-top: 20px;
                padding: 15px;
                border-radius: 4px;
                background: #f8f9fa;
                text-align: left;
                font-family: monospace;
                font-size: 12px;
                max-height: 300px;
                overflow-y: auto;
                display: none;
            }}
            .success {{
                background: #d4edda !important;
                border: 1px solid #c3e6cb;
            }}
            .error {{
                background: #f8d7da !important;
                border: 1px solid #f5c6cb;
            }}
            .loading {{
                display: none;
                margin-top: 20px;
                color: #666;
            }}
            .api-section {{
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
                text-align: left;
            }}
            .api-section h3 {{
                margin: 0 0 10px 0;
                font-size: 14px;
                color: #555;
            }}
            .api-section code {{
                background: #f5f5f5;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 12px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔐 Test Google Login</h1>
            <p class="subtitle">Click below to test Google OAuth integration</p>
            
            <div id="g_id_onload"
                 data-client_id="{google_client_id}"
                 data-callback="handleCredentialResponse"
                 data-auto_prompt="false">
            </div>
            
            <div class="g_id_signin"
                 data-type="standard"
                 data-size="large"
                 data-theme="outline"
                 data-text="sign_in_with"
                 data-shape="rectangular"
                 data-logo_alignment="left">
            </div>
            
            <div class="loading" id="loading">
                Sending token to backend...
            </div>
            
            <pre id="result"></pre>
            
            <div class="api-section">
                <h3>API Endpoint</h3>
                <p>POST <code>/api/v1/auth/google/login</code></p>
                <p style="font-size: 12px; color: #666;">
                    Body: <code>{{"id_token": "..."}}</code>
                </p>
            </div>
        </div>
        
        <script src="https://accounts.google.com/gsi/client" async defer></script>
        <script>
            async function handleCredentialResponse(response) {{
                const resultDiv = document.getElementById('result');
                const loadingDiv = document.getElementById('loading');
                
                loadingDiv.style.display = 'block';
                resultDiv.style.display = 'none';
                resultDiv.className = '';
                
                try {{
                    const res = await fetch('/api/v1/auth/google/login', {{
                        method: 'POST',
                        headers: {{
                            'Content-Type': 'application/json',
                        }},
                        body: JSON.stringify({{
                            id_token: response.credential
                        }})
                    }});
                    
                    const data = await res.json();
                    
                    loadingDiv.style.display = 'none';
                    resultDiv.style.display = 'block';
                    resultDiv.textContent = JSON.stringify(data, null, 2);
                    
                    if (res.ok) {{
                        resultDiv.classList.add('success');
                    }} else {{
                        resultDiv.classList.add('error');
                    }}
                    
                }} catch (error) {{
                    loadingDiv.style.display = 'none';
                    resultDiv.style.display = 'block';
                    resultDiv.classList.add('error');
                    resultDiv.textContent = 'Error: ' + error.message;
                }}
            }}
        </script>
    </body>
    </html>
    """
    
    return HTMLResponse(content=html_content)
