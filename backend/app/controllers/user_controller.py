from fastapi import (
    FastAPI,
    HTTPException,
    Depends,
    Header,
    APIRouter,
    UploadFile,
    File,
)  # -->
import io
from uuid import uuid4
from fastapi import Depends, Header, HTTPException, UploadFile
from app.models.userdb import userSchema
from app.schema.user import User
from app.schema.login import Login_user
from app.schema.token import Token
from app.schema.address import address
from app.schema.amount import Amount
from sqlalchemy.orm import Session  # -->
from app.database import getDb  # -->
from app.utils import auth
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from firebase_admin.exceptions import FirebaseError
import requests
import firebase_admin
from firebase_admin import credentials, storage
import stripe
import os
from dotenv import load_dotenv

load_dotenv()
stripe.api_key = os.getenv("stripe_secret_key")  # Replace with your actual Stripe secret key

cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(
    cred,
    {
        "storageBucket": "mini-project-cbe23.appspot.com",
    },
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")  # -->
temp_store = {}


def signup(user: User, db: Session = Depends(getDb)):

    dbUser = auth.getUser(db, user.email)

    if dbUser:
        raise HTTPException(status_code=409, detail="Username already registered")
    hashed_password = auth.getPasswordHash(user.password)

    temp_user_data = {
        "email": user.email,
        "contact": user.contact,
        "hash_password": hashed_password,
    }
    global temp_store
    temp_store.clear()
    temp_store = temp_user_data

    return HTTPException(status_code=200, detail="Successfully registered")


# for router -->route.py(defining router module wise)
# create a repo folder --user_repo


def login(login_user: Login_user, db: Session = Depends(getDb)):
    login_dbUser = auth.getUser(db, login_user.email)
    print(login_dbUser)
    if not login_dbUser or not auth.verifyPassword(
        login_user.password, login_dbUser.hash_password
    ):
        raise HTTPException(status_code=402, detail="Invalid credentials")

    access_token = auth.createAccessToken(
        data={"sub": login_user.email}
    )  # handle logic in controller regarding authentication.
    print(access_token)
    return {"access_token": access_token, "token_type": "bearer"}


def saveVerifiedUser(db: Session = Depends(getDb)):
    print("temp_store", temp_store)

    db_user = userSchema(
        email=temp_store["email"],
        hash_password=temp_store["hash_password"],
        contact=temp_store["contact"],
    )
    temp_store.clear()
    print("db_user", db_user)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return HTTPException(status_code=201, detail="Successfully verified")


def verify_google_token(token: str) -> dict:

    response = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={token}")
    response.raise_for_status()
    return response.json()


def google_login(email, db: Session = Depends(getDb)):
    print("google_login")
    access_token = auth.createAccessToken(
        data={"sub": email}
    )  # handle logic in controller regarding authentication.
    print("access", access_token)

    return {"access_token": access_token, "token_type": "bearer"}


def get_user_data(token: str = Header(...), db: Session = Depends(getDb)):
    try:
        email = auth.decodeAccessToken(token)
        print("token_email:", email)

        if not email:
            raise HTTPException(status_code=401, detail="Email not found in token")

        user = auth.getUser(db, email)
        print("user:", user)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return user
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fetching user data: {str(e)}",
        )


UPLOAD_FOLDER = "uploads/profile_images"


async def handle_profile_upload(file: UploadFile, db: Session, email):   
    try:
        filename = f"{uuid4()}.{file.filename.split('.')[-1]}"
        bucket = storage.bucket()
        ("bucket")
        blob = bucket.blob(f"profile_images/{filename}")
        # Read the file data
        file_data = await file.read()
        blob.upload_from_file(io.BytesIO(file_data), content_type=file.content_type)
        # public url
        blob.make_public()
        profile_image_url = blob.public_url

        # Update the user's profile image path in the database
        user = db.query(userSchema).filter(userSchema.email == email).first()
        if not user:
            return None        
        user.profile_image = profile_image_url
        db.commit()
        db.refresh(user)
        print("user.profile_image", user.profile_image)

        if not user.profile_image:
            print("user.profile_image", user.profile_image)
            raise HTTPException(
                status_code=500, detail="Failed to update user profile image path"
            )

        return user
    except FirebaseError as fe:
        # Handle specific Firebase errors
        raise HTTPException(status_code=500, detail=f"Firebase error: {str(fe)}")
    
    
async def handle_address_update(address:address,authorization: str = Header(...),db:Session=Depends(getDb)):
    
    token=authorization.split(" ")[1]
    
    email=auth.decodeAccessToken(token)
    
    current_user = auth.getUser(db, email)
    
    current_user.residing_address=address
    db.commit()
    db.refresh(current_user)
    return current_user


async def handle_payment(amount:Amount):
    print(amount.amount_pay)
    payment_intent = stripe.PaymentIntent.create(
            amount=amount.amount_pay,
            currency="usd",
            payment_method_types=["card"],
        )
    print("payment_intent", payment_intent)
    return {"clientSecret": payment_intent['client_secret']}
