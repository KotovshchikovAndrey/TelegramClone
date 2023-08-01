import typing as tp

from io import BytesIO
from pydantic import BaseModel, UUID4, IPvAnyAddress
from datetime import datetime, date


class UserBase(BaseModel):
    name: str
    surname: str
    phone: str
    email: str


class UserInDB(UserBase):
    user_uuid: UUID4
    created_at: datetime
    about_me: str | None = None
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


class ProfilePublic(BaseModel):
    name: str
    surname: str
    about_me: str | None = None
    birthday: date | None = None

    class Config:
        from_attributes = True


class ProfileUpdate(ProfilePublic):
    pass


class UserAvatar(BaseModel):
    # file: BytesIO
    ext: str


class UserPayload(UserBase):
    user_uuid: UUID4

    class Config:
        from_attributes = True
