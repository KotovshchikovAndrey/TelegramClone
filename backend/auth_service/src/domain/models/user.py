import typing as tp
from pydantic import BaseModel, UUID4, IPvAnyAddress, EmailStr, validator
from datetime import datetime, date


class UserBase(BaseModel):
    name: str
    surname: str
    phone: str
    email: str


class UserInDB(UserBase):
    user_uuid: UUID4
    password: str | None = None
    created_at: datetime
    avatar: str | None = None
    birthday: date | None = None

    class Config:
        from_attributes = True


class UserCreate(UserBase):
    ...


class UserLogin(BaseModel):
    phone: str


class UserFingerPrint(BaseModel):
    user_device: str
    user_ip: IPvAnyAddress
    user_location: str | None = None
