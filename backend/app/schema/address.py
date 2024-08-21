from pydantic import BaseModel

class address(BaseModel):
    suggestedAddress:str
    houseNumber:str
    zip:str
    