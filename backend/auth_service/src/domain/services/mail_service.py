import typing as tp

from kink import inject
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr, BaseModel


class EmailSchema(BaseModel):
    email: tp.List[EmailStr]


@inject
class MailService:
    _mail_config: ConnectionConfig

    def __init__(self, mail_config: ConnectionConfig) -> None:
        self._mail_config = mail_config

    async def send_mail(self, email: EmailSchema):
        message = MessageSchema(
            subject="Fastapi-Mail module",
            recipients=email.email,
            template_body={"message": "Hello!"},
            subtype=MessageType.html,
        )

        fm = FastMail(self._mail_config)
        await fm.send_message(message, template_name="confirm_email.html")
