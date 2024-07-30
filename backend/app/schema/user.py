from pydantic import BaseModel

class User(BaseModel):
    email: str
    contact: str
    password: str
