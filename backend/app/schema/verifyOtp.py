from pydantic import BaseModel
class verifyOtp(BaseModel):
    contact:str
    otp:str