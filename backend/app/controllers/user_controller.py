from fastapi import FastAPI, HTTPException, Depends, Header, APIRouter  # -->
from app.models.userdb import userSchema
from app.schema.user import User
from app.schema.login import Login_user
from app.schema.token import Token
from sqlalchemy.orm import Session  # -->
from app.database import getDb  # -->
from app.utils import auth
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import random


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")  # -->


def signup(user: User, db: Session = Depends(getDb)):
    dbUser = auth.getUser(db, user.email)
   
    if dbUser:
        raise HTTPException(status_code=409, detail="Username already registered")
    hashed_password = auth.getPasswordHash(user.password)
    db_user = userSchema(
        email=user.email, hash_password=hashed_password, contact=user.contact
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return HTTPException(status_code=201, detail="Successfully registered")

# for router -->route.py(defining router module wise)
#create a repo folder --user_repo 

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


