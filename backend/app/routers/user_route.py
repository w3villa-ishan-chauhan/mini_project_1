from fastapi import APIRouter, Depends, Header, HTTPException, UploadFile, File
from app.schema.user import User
from app.schema.googleLogin import GoogleLoginRequest
from app.schema.login import Login_user
from app.schema.verifyOtp import verifyOtp
from app.schema.googleUser import googleUser
from app.schema.address import address
from app.schema.token import Token
from app.utils import auth
from app.models.userdb import userSchema
from sqlalchemy.orm import Session  # -->
from app.database import getDb
from app.controllers import user_controller
from app.utils import auth
from app.schema.amount import Amount


from app.services_1.sms_service import (
    send_verification_code,
    verify_code,
    verify_email_code,
    send_email,
)

user_router = APIRouter()


@user_router.post("/api/signup")
def signup(user: User, db: Session = Depends(getDb)):

    result = user_controller.signup(user, db)
    send_verification_code(user.contact)
    send_email(user.email)

    return HTTPException(status_code=200, detail="Signup successful")


@user_router.post("/api/verify-otp")
def verify_otp(data: verifyOtp, db: Session = Depends(getDb)):
    print("data:", data)
    if verify_code(data.contact, data.otp) and verify_email_code(
        data.email, data.email_otp
    ):
        user_controller.saveVerifiedUser(db)
        return {"message": "OTP verified successfully", "status": 200}
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP")


@user_router.post("/api/login")
def login(login_user: Login_user, db: Session = Depends(getDb)):
    try:
        result = user_controller.login(login_user, db)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail="An error occurred during login")


@user_router.post("/api/google-login")
def google_login(request: GoogleLoginRequest, db: Session = Depends(getDb)):
    try:
        google_user_info = user_controller.verify_google_token(request.credential)
        email = google_user_info.get("email")
        print("email", email)

        if not email:
            raise HTTPException(status_code=400, detail="Google token is invalid")
        dbUser = auth.getUser(db, email)

        # print("dbUser before", dbUser.contact)
        if dbUser is None:
            dbUser = userSchema(
                email=email,
                contact="n/A",
                hash_password="n/A",
            )
            print("dbUser::", dbUser)
            db.add(dbUser)
            db.commit()
            db.refresh(dbUser)

        result = user_controller.google_login(email, db)
        print("result:", result)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=400, detail="An error occurred during Google login"
        )


@user_router.get("/api/get_user")
def read_user_data(authorization: str = Header(...), db: Session = Depends(getDb)):
    token = authorization.split(" ")[1]  # Assuming Bearer token

    user = user_controller.get_user_data(token, db)
    print("user", user)
    return user


@user_router.post("/api/set_profile")
async def set_profile(
    file: UploadFile = File(...),
    authorization: str = Header(...),
    db: Session = Depends(getDb),
):
    try:
        
        token = authorization.split(" ")[1]  # Assuming Bearer token
        
        email = auth.decodeAccessToken(token)
        print(email)

        current_user = auth.getUser(db, email)
        print("current_user", current_user)
        if not current_user:
            raise HTTPException(status_code=403, detail="Not authenticated")

        updated_user = await user_controller.handle_profile_upload(file, db, email)

        return {"profile_image_path": updated_user.profile_image}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@user_router.post("/api/update_address")
async def update_address(
    address: address, authorization: str = Header(...), db: Session = Depends(getDb)
):
    print(address)
    try:
        updated_user = await user_controller.handle_address_update(
            address, authorization, db
        )
        return {"user": updated_user}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@user_router.post("/api/payment_intent")
async def payment_intent(amount:Amount):
    try:
        print("payment_intent")
        payment_confirmation = await user_controller.handle_payment(amount)
        return payment_confirmation
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
