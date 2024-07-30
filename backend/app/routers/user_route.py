from fastapi import APIRouter, Depends, Header, HTTPException
from app.schema.user import User
from app.schema.login import Login_user
from app.schema.verifyOtp import verifyOtp
from app.utils import auth
from app.models.userdb import userSchema
from sqlalchemy.orm import Session  # -->
from app.database import getDb
from app.controllers import user_controller
from app.services_1.sms_service import send_verification_code, verify_code

user_router = APIRouter()

@user_router.post("/api/signup")
def signup(user: User, db: Session = Depends(getDb)):
    try:
        result =user_controller.signup(user, db)
        send_verification_code(user.contact)
        print("status")
        return {"status": "success", "message": "Signup successful. Please log in."}

    except Exception as e:
        raise e


@user_router.post("/api/verify-otp")
def verify_otp(data: verifyOtp, db: Session = Depends(getDb)):
    print(data)
    if verify_code(data.contact, data.otp):
        
        return {"message": "OTP verified successfully","status":200}
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP")


@user_router.post("/api/login")
def login(login_user: Login_user, db: Session = Depends(getDb)):
    try:
        result = user_controller.login(login_user, db)
        return result
    except Exception as e:
        print(e)


