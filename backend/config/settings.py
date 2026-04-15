from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")
    
    APP_NAME: str = "Road App API"
    DEBUG: bool = False
    VERSION: str = "1.0.0"
    
    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "road_app_db"
    
    # JWT
    JWT_SECRET_KEY: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    ALLOWED_ORIGINS: list = ["*"]
    
    # MSG91 OTP
    MSG91_AUTH_KEY: str = ""
    MSG91_SENDER_ID: str = "ROADAPP"
    MSG91_ROUTE: str = "4"  # 4 for transactional
    MSG91_OTP_TEMPLATE_ID: str = ""
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    
    # Apple OAuth
    APPLE_CLIENT_ID: str = ""  # Service ID
    APPLE_TEAM_ID: str = ""
    APPLE_KEY_ID: str = ""
    APPLE_PRIVATE_KEY: str = ""  # Base64 encoded or raw
    
    # Frontend URL for redirects
    FRONTEND_URL: str = "http://localhost:3000"


settings = Settings()
