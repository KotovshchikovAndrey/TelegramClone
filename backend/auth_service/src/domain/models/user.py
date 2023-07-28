import typing as tp
from pydantic import BaseModel, UUID4, EmailStr, validator
from datetime import datetime, date


class UserBase(BaseModel):
    name: str
    surname: str
    phone: str
    email: str


class UserInDB(UserBase):
    user_id: UUID4
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
    user_ip: str
    user_location: str | None = None


class UserLoginConfirm(BaseModel):
    email: EmailStr
    code: int
    session_key: str

    @validator("code")
    def validate_code(cls, code: int):
        if len(str(code)) != 5:
            raise ValueError("Code length must be 6 symbols!")

        return code
