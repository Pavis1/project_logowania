from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserBase(BaseModel):
    name: str
    surname: str
    email: EmailStr
    role: str


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: Optional[str]
    surname: Optional[str]
    email: Optional[EmailStr]
    role: Optional[str]
    password: Optional[str]


class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True