from datetime import datetime
from typing import Optional, Any, Annotated
from pydantic import BaseModel, EmailStr, Field, ConfigDict, BeforeValidator
from bson import ObjectId
from enum import Enum
from pydantic_core import core_schema


class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type: Any, _handler: Any
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ]),
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x), when_used='json'
            ),
        )

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, _core_schema, handler):
        return handler(core_schema.str_schema())


class AuthProvider(str, Enum):
    EMAIL = "email"
    GOOGLE = "google"
    APPLE = "apple"
    MOBILE_OTP = "mobile_otp"


class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    mobile: Optional[str] = None
    full_name: Optional[str] = None
    is_active: bool = True
    is_verified: bool = False
    role: str = "user"  # user, admin, manager
    auth_provider: AuthProvider = AuthProvider.EMAIL
    country_code: Optional[str] = "+91"


class UserCreate(UserBase):
    password: Optional[str] = Field(None, min_length=6, max_length=100)


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    mobile: Optional[str] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    country_code: Optional[str] = None


class UserInDB(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    hashed_password: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    # Social login fields
    google_id: Optional[str] = None
    apple_id: Optional[str] = None

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )


class UserResponse(UserBase):
    id: Annotated[str, BeforeValidator(str)] = Field(alias="_id")
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )


class UserLogin(BaseModel):
    email: Optional[EmailStr] = None
    mobile: Optional[str] = None
    password: Optional[str] = None
    otp: Optional[str] = None


class OTPRequest(BaseModel):
    mobile: str
    country_code: str = "+91"


class OTPVerify(BaseModel):
    mobile: str
    otp: str
    country_code: str = "+91"


class GoogleLogin(BaseModel):
    id_token: str


class AppleLogin(BaseModel):
    identity_token: str
    authorization_code: Optional[str] = None
    user_identifier: Optional[str] = None


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenPayload(BaseModel):
    sub: str  # user_id
    exp: datetime
    type: str  # access or refresh
    role: Optional[str] = None
    email: Optional[str] = None
    mobile: Optional[str] = None


class AuthResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None
