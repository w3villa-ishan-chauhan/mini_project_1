
from sqlalchemy import Column,Integer,String
from app.database import Base
class userSchema(Base):   
   __tablename__="users"
   id=Column(Integer,primary_key=True,index=True)
   email=Column(String(255),unique=True,index=True)
   hash_password=Column(String(255))
   contact=Column(String(20),unique=True,index=True)
   