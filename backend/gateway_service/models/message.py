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


class UserMessageStatusUpdate(BaseModel):
    message: str
    status: tp.Literal["sent", "delivered", "readed"]


class MessageAction(BaseModel):
    action_type: tp.Literal[
        "create_personal_message",
        "update_message",
        "update_message_status_for_user",
    ]
    data: tp.Mapping[tp.Any, tp.Any]
