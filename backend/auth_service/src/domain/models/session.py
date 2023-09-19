import typing as tp

from datetime import datetime
from pydantic import BaseModel, IPvAnyAddress, validator


class SessionPayload(BaseModel):
    user_device: str
    user_ip: IPvAnyAddress
    user_location: str
    created_at: str


class SessionData(SessionPayload):
    activation_code: int
    is_active: bool = False


class SessionBase(BaseModel):
    data: SessionData
    expire: int


class SessionInDB(SessionBase):
    session_key: str


class SessionCreate(SessionBase):
    ...


class SessionUpdate(SessionBase):
    ...


class SessionActivation(BaseModel):
    code: int
    session_key: str

    @validator("code")
    def validate_code(cls, code: int):
        if len(str(code)) != 5:
            raise ValueError("Code length must be 5 symbols!")

        return code
