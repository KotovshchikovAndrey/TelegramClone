import typing as tp

from kink import inject
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from domain.models.mail import LoginConfirmEmail


@inject
class MailService:
    _mail_config: ConnectionConfig

    def __init__(self, mail_config: ConnectionConfig) -> None:
        self._mail_config = mail_config

    async def send_login_confirm_mail(self, email: LoginConfirmEmail):
        message = MessageSchema(
            subject="Confirm registration",
            recipients=[email.email],
            template_body={"code": email.code},
            subtype=MessageType.html,
        )

        fm = FastMail(self._mail_config)
        await fm.send_message(message, template_name="confirm_email.html")
