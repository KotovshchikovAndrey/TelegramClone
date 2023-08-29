import typing as tp
from pydantic import Base64Bytes, BaseModel, Field


class File(BaseModel):
    filename: str
    content: Base64Bytes


class PersonalMessageCreate(BaseModel):
    reciever: str
    text: str = Field(max_length=500)
    files: tp.List[File] = []


class MessageUpdate(BaseModel):
    uuid: str
    text: str = Field(max_length=500)
    files: tp.List[File] = []


class MessageAction(BaseModel):
    action_type: str
    data: tp.Mapping[tp.Any, tp.Any]
