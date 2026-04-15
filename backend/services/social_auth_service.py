import jwt as pyjwt
import httpx
from typing import Optional, Dict
from datetime import datetime
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from config.settings import settings


class GoogleAuthService:
    """Google OAuth verification service"""
    
    def __init__(self):
        self.client_id = settings.GOOGLE_CLIENT_ID
        self.client_secret = settings.GOOGLE_CLIENT_SECRET
    
    def verify_token(self, id_token_str: str) -> Optional[Dict]:
        """
        Verify Google ID token and return user info
        """
        try:
            if not self.client_id:
                # Test mode - decode without verification
                return self._decode_without_verification(id_token_str)
            
            # Verify token with Google's library
            idinfo = id_token.verify_oauth2_token(
                id_token_str, 
                google_requests.Request(), 
                self.client_id
            )
            
            # Check issuer
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                return None
            
            return {
                "email": idinfo.get("email"),
                "name": idinfo.get("name"),
                "picture": idinfo.get("picture"),
                "email_verified": idinfo.get("email_verified", False),
                "google_id": idinfo.get("sub"),
                "given_name": idinfo.get("given_name"),
                "family_name": idinfo.get("family_name")
            }
            
        except Exception as e:
            print(f"Google token verification error: {e}")
            return None
    
    def _decode_without_verification(self, token: str) -> Optional[Dict]:
        """Decode token without verification for testing"""
        try:
            payload = pyjwt.decode(token, options={"verify_signature": False})
            return {
                "email": payload.get("email"),
                "name": payload.get("name"),
                "picture": payload.get("picture"),
                "email_verified": payload.get("email_verified", False),
                "google_id": payload.get("sub"),
                "given_name": payload.get("given_name"),
                "family_name": payload.get("family_name")
            }
        except Exception:
            return None
    
    async def get_user_info(self, access_token: str) -> Optional[Dict]:
        """Get user info using access token"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    headers={"Authorization": f"Bearer {access_token}"}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "email": data.get("email"),
                        "name": data.get("name"),
                        "picture": data.get("picture"),
                        "email_verified": data.get("email_verified", False),
                        "google_id": data.get("sub")
                    }
                return None
        except Exception as e:
            print(f"Error fetching Google user info: {e}")
            return None


class AppleAuthService:
    """Apple Sign In verification service"""
    
    APPLE_JWKS_URL = "https://appleid.apple.com/auth/keys"
    APPLE_ISSUER = "https://appleid.apple.com"
    
    def __init__(self):
        self.client_id = settings.APPLE_CLIENT_ID
        self.team_id = settings.APPLE_TEAM_ID
        self.key_id = settings.APPLE_KEY_ID
        self.private_key = settings.APPLE_PRIVATE_KEY
    
    async def verify_token(self, identity_token: str) -> Optional[Dict]:
        """
        Verify Apple identity token
        """
        try:
            if not self.client_id:
                # Test mode - decode without verification
                return self._decode_without_verification(identity_token)
            
            # Fetch Apple's public keys
            async with httpx.AsyncClient() as client:
                jwks_response = await client.get(self.APPLE_JWKS_URL)
                jwks = jwks_response.json()
            
            # Get unverified header to find key ID
            unverified_header = pyjwt.get_unverified_header(identity_token)
            kid = unverified_header.get("kid")
            
            # Find matching key
            key = next((k for k in jwks["keys"] if k["kid"] == kid), None)
            if not key:
                return None
            
            # Import key and verify token
            from cryptography.hazmat.primitives import serialization
            from cryptography.hazmat.backends import default_backend
            
            # Convert JWK to PEM
            public_key = self._jwk_to_pem(key)
            
            # Decode and verify
            payload = pyjwt.decode(
                identity_token,
                public_key,
                algorithms=["RS256"],
                audience=self.client_id,
                issuer=self.APPLE_ISSUER
            )
            
            return {
                "email": payload.get("email"),
                "apple_id": payload.get("sub"),
                "email_verified": payload.get("email_verified") == "true"
            }
            
        except pyjwt.ExpiredSignatureError:
            print("Apple token expired")
            return None
        except Exception as e:
            print(f"Apple token verification error: {e}")
            return None
    
    def _decode_without_verification(self, token: str) -> Optional[Dict]:
        """Decode token without verification for testing"""
        try:
            payload = pyjwt.decode(token, options={"verify_signature": False})
            return {
                "email": payload.get("email"),
                "apple_id": payload.get("sub"),
                "email_verified": payload.get("email_verified") == "true"
            }
        except Exception:
            return None
    
    def _jwk_to_pem(self, jwk: dict) -> bytes:
        """Convert JWK to PEM format"""
        from cryptography.hazmat.primitives import serialization
        from cryptography.hazmat.primitives.asymmetric import rsa
        from cryptography.hazmat.backends import default_backend
        import base64
        
        # Extract RSA components
        n = int.from_bytes(base64.urlsafe_b64decode(jwk["n"] + "=="), "big")
        e = int.from_bytes(base64.urlsafe_b64decode(jwk["e"] + "=="), "big")
        
        # Build RSA public key
        public_numbers = rsa.RSAPublicNumbers(e, n)
        public_key = public_numbers.public_key(backend=default_backend())
        
        # Export as PEM
        pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        
        return pem
    
    async def generate_client_secret(self) -> str:
        """Generate client secret for Apple Sign In server-to-server calls"""
        try:
            from cryptography.hazmat.primitives import serialization
            from cryptography.hazmat.backends import default_backend
            
            # Decode private key if it's base64 encoded
            private_key_bytes = self.private_key.encode()
            
            # Load private key
            private_key = serialization.load_pem_private_key(
                private_key_bytes,
                password=None,
                backend=default_backend()
            )
            
            # Generate JWT
            now = datetime.utcnow()
            headers = {
                "alg": "ES256",
                "kid": self.key_id
            }
            payload = {
                "iss": self.team_id,
                "iat": now,
                "exp": now + datetime.timedelta(hours=1),
                "aud": "https://appleid.apple.com",
                "sub": self.client_id
            }
            
            client_secret = pyjwt.encode(
                payload,
                private_key,
                algorithm="ES256",
                headers=headers
            )
            
            return client_secret
            
        except Exception as e:
            print(f"Error generating Apple client secret: {e}")
            return ""


# Create singleton instances
google_auth_service = GoogleAuthService()
apple_auth_service = AppleAuthService()
