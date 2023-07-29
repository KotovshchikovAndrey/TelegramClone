import typing as tp
from pydantic import BaseModel, IPvAnyAddress, EmailStr, validator


class SessionPayload(BaseModel):
    user_device: str
    user_ip: IPvAnyAddress
    user_location: str


class SessionData(SessionPayload):
    login_code: int
    is_active: bool = False


class SessionBase(BaseModel):
    data: SessionData
    expire: int


class SessionInDB(SessionBase):
    session_key: str


class SessionCreate(SessionBase):
    pass


class SessionLogin(BaseModel):
    code: int
    session_key: str

    @validator("code")
    def validate_code(cls, code: int):
        if len(str(code)) != 5:
            raise ValueError("Code length must be 6 symbols!")

        return code
