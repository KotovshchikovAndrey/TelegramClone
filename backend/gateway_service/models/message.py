import typing as tp
from datetime import datetime

from pydantic import Base64Bytes, BaseModel, Field


class PrivateMessageCreate(BaseModel):
    send_to: str
    text: str = Field(max_length=500)
    files: tp.List[Base64Bytes] = []


# class PrivateMessage(BaseModel):
#     uuid: str
#     text: str
#     media_url: str | None = None
#     created_at: datetime
#     send_from: str
#     send_to: str
#     status: str
