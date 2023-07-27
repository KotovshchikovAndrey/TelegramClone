import typing as tp
from pydantic import BaseModel
from datetime import datetime, date


class UserBase(BaseModel):
    name: str
    surname: str
    phone: str
    email: str


class UserInDB(UserBase):
    user_id: int
    password: str
    created_at: datetime
    avatar: str | None = None
    birthday: date | None = None


class UserCreate(UserBase):
    ...
