import asyncio
from unittest.mock import AsyncMock, patch
import json

# Mock settings before importing services
import sys
from types import ModuleType

mock_settings = ModuleType('settings')
mock_settings.MSG91_AUTH_KEY = "test_auth_key"
mock_settings.MSG91_SENDER_ID = "SENDER"
mock_settings.MSG91_ROUTE = "4"
mock_settings.MSG91_OTP_TEMPLATE_ID = "test_template_id"

mock_config = ModuleType('config')
mock_config.settings = mock_settings

sys.modules['config.settings'] = mock_settings
sys.modules['config'] = mock_config

# Import MSG91Service
from services.otp_service import MSG91Service

async def test_send_otp_payload():
    service = MSG91Service()
    
    # Mock _store_otp to avoid DB dependency
    service._store_otp = AsyncMock()
    
    mobile = "+919876543210"
    otp = "123456"
    
    with patch('httpx.AsyncClient.post') as mock_post:
        # Mock successful response
        mock_response = AsyncMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"type": "success", "message": "OTP sent"}
        mock_post.return_value = mock_response
        
        success, message = await service.send_otp(mobile, otp)
        
        # Verify result
        print(f"Success: {success}, Message: {message}")
        
        # Verify payload
        call_args = mock_post.call_args
        actual_url = call_args[0][0]
        actual_json = call_args[1]['json']
        actual_headers = call_args[1]['headers']
        
        print(f"URL: {actual_url}")
        print(f"Payload: {json.dumps(actual_json, indent=2)}")
        print(f"Headers: {json.dumps(actual_headers, indent=2)}")
        
        # Assertions
        assert actual_json['mobile'] == "919876543210", f"Mobile should be cleaned. Got {actual_json['mobile']}"
        assert actual_json['otp'] == otp
        assert actual_json['template_id'] == "test_template_id"
        assert actual_headers['authkey'] == "test_auth_key"
        assert "recipients" not in actual_json, "Payload should NOT contain 'recipients'"

if __name__ == "__main__":
    asyncio.run(test_send_otp_payload())
    print("\nVerification successful!")
