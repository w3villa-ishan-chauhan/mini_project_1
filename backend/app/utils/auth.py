from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
from jwt import PyJWTError
from app.models.userdb import userSchema
import secrets
from jose import JWTError

SECRET_KEY = secrets.token_urlsafe(32)
ALGORITHM = "HS256"

bcrypt=CryptContext(schemes=["bcrypt"],deprecated="auto")

def createAccessToken(data: dict):
    toEncode = data.copy()       
    encodedJwt = jwt.encode(toEncode, SECRET_KEY, algorithm=ALGORITHM)
    return encodedJwt

def decodeAccessToken(token: str):
    try:
        print("jwt")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        print("username",username)
        if username is None:
            return "jwt, username not found!"
        return username
    except JWTError:
        return "Error in JWT Token! :("

def verifyPassword(plainPassword, hashedPassword):
    return bcrypt.verify(plainPassword, hashedPassword)

def getPasswordHash(password):
    return bcrypt.hash(password)

def getUser(db, email: str):
    print(db.query(userSchema).filter(userSchema.email == email).first())
    return db.query(userSchema).filter(userSchema.email == email).first()

def authenticateUser(db, username: str, password: str):
    user = getUser(db, username)
    if not user:
        return False
    if not verifyPassword(password, user.hashedPassword):
        return False
    return user
