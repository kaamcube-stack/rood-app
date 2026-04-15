from services.auth_service import AuthService, auth_service
from services.otp_service import MSG91Service, msg91_service
from services.social_auth_service import GoogleAuthService, AppleAuthService, google_auth_service, apple_auth_service

__all__ = [
    "AuthService",
    "auth_service",
    "MSG91Service",
    "msg91_service",
    "GoogleAuthService",
    "AppleAuthService",
    "google_auth_service",
    "apple_auth_service",
]
