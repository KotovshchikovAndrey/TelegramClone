import typing as tp
from pydantic import BaseModel
from datetime import datetime, date


class SessionBase(BaseModel):
    data: tp.Dict[str, str]
    expire: int


class SessionInDB(SessionBase):
    session_key: str


class SessionCreate(SessionBase):
    pass
