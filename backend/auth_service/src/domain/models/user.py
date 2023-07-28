import typing as tp
from pydantic import BaseModel, UUID4
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
