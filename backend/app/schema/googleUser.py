from pydantic import BaseModel

class googleUser(BaseModel):
    email:str
    first_name:str
    contact:str
