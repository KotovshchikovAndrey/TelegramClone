import typing as tp
from datetime import date, datetime

from pydantic import UUID4, BaseModel, IPvAnyAddress, validator


class UserBase(BaseModel):
    name: str
    surname: str
    phone: str
    email: str


class UserInDB(UserBase):
    user_uuid: UUID4
    created_at: datetime

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


class UserPayload(UserBase):
    user_uuid: UUID4

    class Config:
        from_attributes = True


class UserPublic(BaseModel):
    user_uuid: UUID4
    name: str
    surname: str
    phone: str

    class Config:
        from_attributes = True
