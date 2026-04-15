import asyncio
from unittest.mock import AsyncMock, patch
import json
from datetime import datetime
from bson import ObjectId

# Mocking parts to avoid full DB/FastAPI startup in test
import sys
from types import ModuleType

# Mock Pydantic EmailStr again to avoid idna issues in this environment
class MockEmailStr(str):
    @classmethod
    def __get_pydantic_core_schema__(cls, source, handler):
        from pydantic_core import core_schema
        return core_schema.str_schema()

import pydantic.networks
pydantic.networks.EmailStr = MockEmailStr

# Setup PYTHONPATH
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock database
mock_db = MagicMock()
mock_db.users = AsyncMock()

with patch('config.database.get_database', return_value=mock_db):
    from services.user_service import user_service
    from models.user import UserResponse, UserUpdate

    async def test_get_profile():
        user_id = str(ObjectId())
        mock_user_data = {
            "_id": ObjectId(user_id),
            "email": "test@example.com",
            "full_name": "Test User",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True,
            "role": "user",
            "auth_provider": "email"
        }
        mock_db.users.find_one.return_value = mock_user_data
        
        profile = await user_service.get_user_profile(user_id)
        print(f"Fetched profile: {profile.full_name}")
        assert profile.id == user_id
        assert profile.email == "test@example.com"

    async def test_update_profile():
        user_id = str(ObjectId())
        update_data = UserUpdate(full_name="Updated Name")
        
        mock_updated_data = {
            "_id": ObjectId(user_id),
            "email": "test@example.com",
            "full_name": "Updated Name",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True,
            "role": "user",
            "auth_provider": "email"
        }
        mock_db.users.find_one_and_update.return_value = mock_updated_data
        
        updated_profile = await user_service.update_user_profile(user_id, update_data)
        print(f"Updated profile: {updated_profile.full_name}")
        assert updated_profile.full_name == "Updated Name"

    if __name__ == "__main__":
        asyncio.run(test_get_profile())
        asyncio.run(test_update_profile())
        print("\nVerification successful!")
