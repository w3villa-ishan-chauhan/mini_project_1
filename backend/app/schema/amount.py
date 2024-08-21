from pydantic import BaseModel

class Amount(BaseModel):
    amount_pay: int
