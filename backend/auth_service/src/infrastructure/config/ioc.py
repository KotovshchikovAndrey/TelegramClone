import pathlib
from kink import di
from fastapi_mail import ConnectionConfig

from infrastructure.config.settings import settings
from infrastructure.db.connections.postgres import get_postgres_connection
from infrastructure.db.connections.redis import get_redis_connection


def setup_di_container() -> None:
    di["postgres"] = lambda _: get_postgres_connection(
        host=settings.postgres_host,
        port=settings.postgres_port,
        user=settings.postgres_user,
        password=settings.postgres_password,
        db_name=settings.postgres_db_name,
    )

    di["redis"] = lambda _: get_redis_connection(
        host=settings.redis_host,
        port=settings.redis_port,
        password=settings.redis_password,
    )

    di["mail_config"] = ConnectionConfig(
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
