import typing as tp

from pydantic import BaseModel, EmailStr, Field


class LoginConfirmEmail(BaseModel):
    email: EmailStr
    code: int = Field(max_length=6)
