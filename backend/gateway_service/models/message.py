import typing as tp
from datetime import datetime

from pydantic import UUID4, Base64Bytes, BaseModel, Field


class File(BaseModel):
    filename: str
    content: Base64Bytes


class PersonalMessageCreate(BaseModel):
    send_to: str
    text: str = Field(max_length=500)
    files: tp.List[File] = []


class PersonalMessageUpdate(BaseModel):
    uuid: str
    text: str = Field(max_length=500)
    files: tp.List[File] = []


class MessageAction(BaseModel):
    action_type: str
    data: tp.Mapping[tp.Any, tp.Any]


# class PersonalMessage(BaseModel):
#     uuid: str
#     text: str
#     media_url: str | None = None
#     created_at: datetime
#     send_from: str
#     send_to: str
#     status: str
