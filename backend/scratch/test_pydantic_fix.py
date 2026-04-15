import sys
import os
from datetime import datetime
from unittest.mock import MagicMock

# Add backend to path
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(backend_path)

# Mock email_validator and idna before importing models to avoid environment errors
class MockEmailStr(str):
    @classmethod
    def __get_pydantic_core_schema__(cls, source, handler):
        from pydantic_core import core_schema
        return core_schema.str_schema()

# Intercept Pydantic imports to swap EmailStr
import pydantic.networks
pydantic.networks.EmailStr = MockEmailStr

try:
    from bson import ObjectId
    from models.user import UserInDB, UserResponse
    
    print("Successfully imported models with mocked EmailStr.")
    
    oid = ObjectId()
    
    # 1. Test UserInDB
    user_in_db_data = {
        "_id": oid, # Passing ObjectId
        "email": "test@example.com",
        "full_name": "Test User",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    user_in_db = UserInDB(**user_in_db_data)
    print(f"UserInDB instantiated. id: {user_in_db.id} ({type(user_in_db.id)})")
    assert isinstance(user_in_db.id, ObjectId)
    
    # 2. Test UserResponse (This was failing)
    user_response_data = {
        "_id": oid, # Passing ObjectId
        "email": "test@example.com",
        "full_name": "Test User",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    user_response = UserResponse(**user_response_data)
    print(f"UserResponse instantiated. id: {user_response.id} ({type(user_response.id)})")
    
    # 3. Test JSON serialization
    json_output = user_response.model_dump_json(by_alias=True)
    print(f"JSON Output: {json_output}")
    assert f'"{str(oid)}"' in json_output
    
    print("\nAll verification tests passed!")

except Exception as e:
    print(f"Test failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
