from datetime import datetime
from typing import Optional
from fastapi import HTTPException, status
from bson import ObjectId
from models.user import UserUpdate, UserInDB, UserResponse
from config.database import get_database
from utils.security import hash_password

class UserService:
    def __init__(self):
        pass

    @property
    def db(self):
        return get_database()

    @property
    def users_collection(self):
        return self.db.users

    async def get_user_profile(self, user_id: str) -> UserResponse:
        """Fetch user profile by ID"""
        try:
            user = await self.users_collection.find_one({"_id": ObjectId(user_id)})
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            return UserResponse(**user)
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error fetching profile: {str(e)}"
            )

    async def update_user_profile(self, user_id: str, update_data: UserUpdate) -> UserResponse:
        """Update user profile by ID"""
        try:
            # Prepare update document
            update_dict = update_data.model_dump(exclude_unset=True)
            
            if not update_dict:
                # If no fields to update, just return current profile
                return await self.get_user_profile(user_id)
            
            # Special handling for password
            if "password" in update_dict:
                update_dict["hashed_password"] = hash_password(update_dict.pop("password"))
            
            update_dict["updated_at"] = datetime.utcnow()
            
            # Perform update
            result = await self.users_collection.find_one_and_update(
                {"_id": ObjectId(user_id)},
                {"$set": update_dict},
                return_document=True
            )
            
            if not result:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            
            return UserResponse(**result)
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error updating profile: {str(e)}"
            )

user_service = UserService()
