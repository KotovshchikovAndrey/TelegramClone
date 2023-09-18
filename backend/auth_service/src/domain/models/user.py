import typing as tp
from datetime import datetime

from pydantic import UUID4, BaseModel, IPvAnyAddress, validator, EmailStr
from pydantic_extra_types.phone_numbers import PhoneNumber


class UserPhone(BaseModel):
    phone: PhoneNumber

    @validator("phone")
    def validate_phone(cls, phone: str):
        return phone.replace("tel:", "").replace("-", "")


class UserBase(UserPhone):
    email: EmailStr


class UserInDB(UserBase):
    user_uuid: UUID4
    created_at: datetime

    class Config:
        from_attributes = True


class UserCreate(UserBase):
    name: str  # Добавить валидацию на длину и пустату
    surname: str  # Добавить валидацию на длину и пустату


class UserLogin(UserPhone):
    ...


class UserFingerPrint(BaseModel):
    user_device: str
    user_ip: IPvAnyAddress
    user_location: str | None = None


class UserPayload(UserBase):
    user_uuid: UUID4

    class Config:
        from_attributes = True


class UserPublic(UserPhone):
    user_uuid: UUID4
    name: str
    surname: str

    class Config:
        from_attributes = True
