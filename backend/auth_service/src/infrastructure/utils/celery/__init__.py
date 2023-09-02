import os
import pathlib

from celery import Celery
from fastapi_mail import ConnectionConfig

from domain.services.mail_service import MailService

try:
    from infrastructure.config.settings import settings

    BROKER_HOST = settings.celery_broker_host
    BROKER_PORT = settings.celery_broker_port

    MAIL_CONFIG = ConnectionConfig(
        MAIL_USERNAME=settings.mail_username,
        MAIL_PASSWORD=settings.mail_password,
        MAIL_FROM=settings.mail_from,
        MAIL_PORT=settings.mail_port,
        MAIL_SERVER=settings.mail_server,
        MAIL_FROM_NAME=settings.mail_from_name,
        MAIL_STARTTLS=True,
        MAIL_SSL_TLS=False,
        TEMPLATE_FOLDER=pathlib.Path("./src") / "common" / "templates",
    )

except ValueError:
    BROKER_HOST = os.environ["CELERY_BROKER_HOST"]
    BROKER_PORT = os.environ["CELERY_BROKER_PORT"]

    MAIL_CONFIG = ConnectionConfig(
        MAIL_USERNAME=os.environ["MAIL_USERNAME"].strip(),
        MAIL_PASSWORD=os.environ["MAIL_PASSWORD"].strip(),
        MAIL_FROM=os.environ["MAIL_FROM"].strip(),
        MAIL_PORT=int(os.environ["MAIL_PORT"].strip()),
        MAIL_SERVER=os.environ["MAIL_SERVER"].strip(),
        MAIL_FROM_NAME=os.environ["MAIL_FROM_NAME"].strip(),
        MAIL_STARTTLS=True,
        MAIL_SSL_TLS=False,
        TEMPLATE_FOLDER=pathlib.Path(".") / "common" / "templates",
    )


celery = Celery("worker", broker=f"redis://{BROKER_HOST}:{BROKER_PORT}")

mail_service = MailService(mail_config=MAIL_CONFIG)
