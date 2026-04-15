from datetime import datetime, timedelta
from typing import Optional, Tuple
from fastapi import HTTPException, status
from bson import ObjectId
from models.user import (
    UserCreate, UserInDB, UserResponse, UserLogin, Token, AuthProvider,
    OTPRequest, OTPVerify, GoogleLogin, AppleLogin
)
from utils.security import hash_password, verify_password, create_access_token, create_refresh_token
from config.database import get_database
from services.otp_service import msg91_service
from services.social_auth_service import google_auth_service, apple_auth_service


class AuthService:
    def __init__(self):
        pass

    @property
    def db(self):
        return get_database()

    @property
    def users_collection(self):
        return self.db.users

    # ============ Email/Password Auth ============

    async def register_user(self, user_data: UserCreate) -> UserResponse:
        # Check if user already exists by email or mobile
        query = {}
        if user_data.email:
            query["email"] = user_data.email
        elif user_data.mobile:
            query["mobile"] = user_data.mobile
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email or mobile required"
            )

        existing_user = await self.users_collection.find_one(query)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already registered"
            )

        # Create user document
        user_dict = user_data.model_dump()

        # Hash password if provided
        if user_dict.get("password"):
            user_dict["hashed_password"] = hash_password(user_dict.pop("password"))
        else:
            user_dict["hashed_password"] = None
            user_dict.pop("password", None)

        user_dict["created_at"] = datetime.utcnow()
        user_dict["updated_at"] = datetime.utcnow()

        user_in_db = UserInDB(**user_dict)

        # Insert into database
        result = await self.users_collection.insert_one(user_in_db.model_dump(by_alias=True))

        # Get created user
        created_user = await self.users_collection.find_one({"_id": result.inserted_id})

        return UserResponse(**created_user)

    async def authenticate_user(self, login_data: UserLogin) -> Optional[UserInDB]:
        # Find user by email or mobile
        query = {}
        if login_data.email:
            query["email"] = login_data.email
        elif login_data.mobile:
            query["mobile"] = login_data.mobile
        else:
            return None

        user = await self.users_collection.find_one(query)
        if not user:
            return None

        # Check password for email login
        if login_data.password and user.get("hashed_password"):
            if not verify_password(login_data.password, user["hashed_password"]):
                return None

        return UserInDB(**user)

    async def login_user(self, login_data: UserLogin) -> Token:
        user = await self.authenticate_user(login_data)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is deactivated"
            )

        return await self._generate_tokens_and_update_login(user)

    # ============ OTP Auth ============

    async def send_otp(self, otp_request: OTPRequest) -> Tuple[bool, str]:
        """Send OTP to mobile number"""
        full_mobile = f"{otp_request.country_code}{otp_request.mobile}"

        # Check if user exists, if not create a placeholder user
        user = await self.users_collection.find_one({"mobile": full_mobile})

        if not user:
            # Create user with mobile OTP auth provider
            user_data = {
                "mobile": full_mobile,
                "country_code": otp_request.country_code,
                "auth_provider": AuthProvider.MOBILE_OTP,
                "is_active": False,  # Will be activated after OTP verification
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            await self.users_collection.insert_one(user_data)

        # Send OTP via MSG91
        success, message = await msg91_service.send_otp(full_mobile)
        return success, message

    async def verify_otp_and_login(self, otp_verify: OTPVerify) -> Tuple[bool, dict]:
        """Verify OTP and login user"""
        full_mobile = f"{otp_verify.country_code}{otp_verify.mobile}"

        # Verify OTP
        is_valid, message = await msg91_service.verify_otp(full_mobile, otp_verify.otp)

        if not is_valid:
            return False, {"message": message}

        # Find or create user
        user = await self.users_collection.find_one({"mobile": full_mobile})

        if not user:
            # Create new user
            user_data = {
                "mobile": full_mobile,
                "country_code": otp_verify.country_code,
                "auth_provider": AuthProvider.MOBILE_OTP,
                "is_active": True,
                "is_verified": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            result = await self.users_collection.insert_one(user_data)
            user = await self.users_collection.find_one({"_id": result.inserted_id})
        else:
            # Activate user if not active
            if not user.get("is_active"):
                await self.users_collection.update_one(
                    {"_id": user["_id"]},
                    {"$set": {"is_active": True, "updated_at": datetime.utcnow()}}
                )
                user["is_active"] = True

        user_in_db = UserInDB(**user)
        tokens = await self._generate_tokens_and_update_login(user_in_db)

        return True, {
            "user": UserResponse(**user),
            "tokens": tokens
        }

    # ============ Google Auth ============

    async def google_login(self, google_data: GoogleLogin) -> Tuple[bool, dict]:
        """Handle Google login/signup"""
        # Verify Google token
        user_info = google_auth_service.verify_token(google_data.id_token)

        if not user_info:
            return False, {"message": "Invalid Google token"}

        email = user_info.get("email")
        google_id = user_info.get("google_id")

        if not email:
            return False, {"message": "Email not provided by Google"}

        # Check if user exists
        user = await self.users_collection.find_one({"email": email})

        if user:
            # Update Google ID if not set
            if not user.get("google_id"):
                await self.users_collection.update_one(
                    {"_id": user["_id"]},
                    {"$set": {"google_id": google_id, "updated_at": datetime.utcnow()}}
                )

            user_in_db = UserInDB(**user)
            tokens = await self._generate_tokens_and_update_login(user_in_db)

            return True, {
                "user": UserResponse(**user),
                "tokens": tokens,
                "is_new_user": False
            }
        else:
            # Create new user
            user_data = {
                "email": email,
                "full_name": user_info.get("name"),
                "google_id": google_id,
                "auth_provider": AuthProvider.GOOGLE,
                "is_active": True,
                "is_verified": user_info.get("email_verified", False),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }

            result = await self.users_collection.insert_one(user_data)
            created_user = await self.users_collection.find_one({"_id": result.inserted_id})

            user_in_db = UserInDB(**created_user)
            tokens = await self._generate_tokens_and_update_login(user_in_db)

            return True, {
                "user": UserResponse(**created_user),
                "tokens": tokens,
                "is_new_user": True
            }

    # ============ Apple Auth ============

    async def apple_login(self, apple_data: AppleLogin) -> Tuple[bool, dict]:
        """Handle Apple login/signup"""
        # Verify Apple token
        user_info = await apple_auth_service.verify_token(apple_data.identity_token)

        if not user_info:
            return False, {"message": "Invalid Apple token"}

        email = user_info.get("email")
        apple_id = user_info.get("apple_id")

        if not apple_id:
            return False, {"message": "Apple ID not found"}

        # Try to find user by Apple ID first
        user = await self.users_collection.find_one({"apple_id": apple_id})

        if not user and email:
            # Fallback to email
            user = await self.users_collection.find_one({"email": email})

        if user:
            # Update Apple ID if not set
            if not user.get("apple_id"):
                await self.users_collection.update_one(
                    {"_id": user["_id"]},
                    {"$set": {"apple_id": apple_id, "updated_at": datetime.utcnow()}}
                )

            user_in_db = UserInDB(**user)
            tokens = await self._generate_tokens_and_update_login(user_in_db)

            return True, {
                "user": UserResponse(**user),
                "tokens": tokens,
                "is_new_user": False
            }
        else:
            # Create new user
            user_data = {
                "email": email,
                "apple_id": apple_id,
                "auth_provider": AuthProvider.APPLE,
                "is_active": True,
                "is_verified": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }

            result = await self.users_collection.insert_one(user_data)
            created_user = await self.users_collection.find_one({"_id": result.inserted_id})

            user_in_db = UserInDB(**created_user)
            tokens = await self._generate_tokens_and_update_login(user_in_db)

            return True, {
                "user": UserResponse(**created_user),
                "tokens": tokens,
                "is_new_user": True
            }

    # ============ Helper Methods ============

    async def _generate_tokens_and_update_login(self, user: UserInDB) -> Token:
        """Generate tokens and update last login"""
        # Update last login
        await self.users_collection.update_one(
            {"_id": ObjectId(user.id)},
            {"$set": {"last_login": datetime.utcnow()}}
        )

        # Create tokens
        user_id_str = str(user.id)
        payload = {"sub": user_id_str, "role": user.role}

        if user.email:
            payload["email"] = user.email
        if user.mobile:
            payload["mobile"] = user.mobile

        access_token = create_access_token(data=payload)
        refresh_token = create_refresh_token(data={"sub": user_id_str})

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=30  # minutes
        )

    async def refresh_access_token(self, user_id: str) -> Token:
        """Generate new access token from refresh"""
        user = await self.get_user_by_id(user_id)

        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user"
            )

        payload = {"sub": user_id, "role": user.role}
        if user.email:
            payload["email"] = user.email
        if user.mobile:
            payload["mobile"] = user.mobile

        access_token = create_access_token(data=payload)
        refresh_token = create_refresh_token(data={"sub": user_id})

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=30
        )

    # ============ User Management ============

    async def get_user_by_id(self, user_id: str) -> Optional[UserResponse]:
        try:
            user = await self.users_collection.find_one({"_id": ObjectId(user_id)})
            if user:
                return UserResponse(**user)
            return None
        except Exception:
            return None

    async def get_user_by_email(self, email: str) -> Optional[UserResponse]:
        user = await self.users_collection.find_one({"email": email})
        if user:
            return UserResponse(**user)
        return None

    async def get_user_by_mobile(self, mobile: str) -> Optional[UserResponse]:
        user = await self.users_collection.find_one({"mobile": mobile})
        if user:
            return UserResponse(**user)
        return None

    async def get_current_user(self, user_id: str) -> UserResponse:
        user = await self.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user


auth_service = AuthService()
