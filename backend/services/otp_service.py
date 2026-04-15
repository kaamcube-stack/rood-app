import random
import string
from datetime import datetime, timedelta
from typing import Tuple
import httpx
from config.settings import settings
from config.database import get_database


class MSG91Service:
    """MSG91 OTP Service for sending and verifying OTPs via SMS"""
    
    BASE_URL = "https://control.msg91.com/api"
    
    def __init__(self):
        self.auth_key = settings.MSG91_AUTH_KEY
        self.sender_id = settings.MSG91_SENDER_ID
        self.route = settings.MSG91_ROUTE
        self.template_id = settings.MSG91_OTP_TEMPLATE_ID

    @property
    def db(self):
        return get_database()
    
    def _generate_otp(self, length: int = 5) -> str:
        """Generate a numeric OTP"""
        return ''.join(random.choices(string.digits, k=length))
    
    async def send_otp(self, mobile: str, otp: str = None) -> Tuple[bool, str]:
        """
        Send OTP to mobile number using MSG91
        Returns: (success: bool, message: str)
        """
        # Clean mobile number (strip +)
        clean_mobile = mobile.replace("+", "")
        
        if not self.auth_key:
            # Fallback: Just store OTP in DB for testing
            generated_otp = otp or self._generate_otp()
            await self._store_otp(mobile, generated_otp)
            print(f"[TEST MODE] OTP for {mobile}: {generated_otp}")
            return True, generated_otp
        
        try:
            generated_otp = otp or self._generate_otp()
            
            # Store OTP in database first
            await self._store_otp(mobile, generated_otp)
            
            # Prepare MSG91 API request (V5 OTP specification)
            url = f"{self.BASE_URL}/v5/otp"
            
            payload = {
                "template_id": self.template_id,
                "mobile": clean_mobile,
                "otp": generated_otp,
                "authkey": self.auth_key
            }
            
            headers = {
                "accept": "application/json",
                "content-type": "application/json",
                "authkey": self.auth_key
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, headers=headers)
                response_data = response.json()
                
                if response.status_code == 200 and response_data.get("type") == "success":
                    return True, generated_otp
                else:
                    error_msg = response_data.get("message", "Failed to send OTP")
                    return False, error_msg
                    
        except Exception as e:
            return False, f"Error sending OTP: {str(e)}"
    
    async def resend_otp(self, mobile: str, retry_type: str = "text") -> Tuple[bool, str]:
        """
        Resend OTP using MSG91 retry API
        retry_type: 'text' or 'voice'
        """
        if not self.auth_key:
            # Fallback for testing
            return await self.send_otp(mobile)
        
        try:
            # Clean mobile number
            clean_mobile = mobile.replace("+", "")
            
            url = f"{self.BASE_URL}/v5/otp/retry"
            
            payload = {
                "authkey": self.auth_key,
                "mobile": clean_mobile,
                "retrytype": retry_type
            }
            
            headers = {
                "accept": "application/json",
                "content-type": "application/json"
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, headers=headers)
                response_data = response.json()
                
                if response.status_code == 200 and response_data.get("type") == "success":
                    return True, "OTP resent successfully"
                else:
                    error_msg = response_data.get("message", "Failed to resend OTP")
                    return False, error_msg
                    
        except Exception as e:
            return False, f"Error resending OTP: {str(e)}"
    
    async def verify_otp(self, mobile: str, otp: str) -> Tuple[bool, str]:
        """
        Verify OTP from database (MSG91 handles this via their API too,
        but we verify locally for better control)
        """
        try:
            # Check in database
            otp_record = await self.db.otps.find_one({
                "mobile": mobile,
                "otp": otp,
                "expires_at": {"$gt": datetime.utcnow()}
            })
            
            if not otp_record:
                return False, "Invalid or expired OTP"
            
            # Delete used OTP
            await self.db.otps.delete_one({"_id": otp_record["_id"]})
            
            return True, "OTP verified successfully"
            
        except Exception as e:
            return False, f"Error verifying OTP: {str(e)}"
    
    async def _store_otp(self, mobile: str, otp: str, expiry_minutes: int = 10):
        """Store OTP in MongoDB with expiry"""
        expires_at = datetime.utcnow() + timedelta(minutes=expiry_minutes)
        
        await self.db.otps.update_one(
            {"mobile": mobile},
            {
                "$set": {
                    "mobile": mobile,
                    "otp": otp,
                    "expires_at": expires_at,
                    "created_at": datetime.utcnow(),
                    "attempts": 0
                }
            },
            upsert=True
        )
    
    async def increment_attempts(self, mobile: str) -> int:
        """Increment OTP attempt counter"""
        result = await self.db.otps.find_one_and_update(
            {"mobile": mobile},
            {"$inc": {"attempts": 1}},
            return_document=True
        )
        return result.get("attempts", 0) if result else 0


# Create singleton instance
msg91_service = MSG91Service()
