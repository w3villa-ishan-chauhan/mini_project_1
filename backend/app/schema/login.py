from pydantic import BaseModel

class Login_user(BaseModel):
    email:str
    password:str