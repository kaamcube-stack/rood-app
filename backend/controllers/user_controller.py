from fastapi import APIRouter, Depends, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from models.user import UserResponse, UserUpdate
from services.user_service import user_service
from middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/user", tags=["User Profile"])

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: UserResponse = Depends(get_current_user)):
    """
    Get current logged-in user profile.
    """
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(current_user)
    )

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    update_data: UserUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Update current logged-in user profile.
    """
    updated_user = await user_service.update_user_profile(str(current_user.id), update_data)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(updated_user)
    )
