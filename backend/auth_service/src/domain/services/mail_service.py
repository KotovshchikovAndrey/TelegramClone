import typing as tp

from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType


class MailService:
    _mail_config: ConnectionConfig

    def __init__(self, mail_config: ConnectionConfig) -> None:
        self._mail_config = mail_config

    async def send_login_code(self, email: str, code: int):
        message = MessageSchema(
            subject="Confirm registration",
            recipients=[email],
            template_body={"code": code},
            subtype=MessageType.html,
        )

        fm = FastMail(self._mail_config)
        await fm.send_message(message, template_name="confirm_email.html")
