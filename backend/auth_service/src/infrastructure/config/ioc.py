from kink import di

from infrastructure.config.settings import settings
from infrastructure.db.connections.postgres import get_postgres_connection
from infrastructure.db.connections.redis import get_redis_connection
from infrastructure.utils.kafka.kafka_interfaces import IKafkaProducer
from infrastructure.utils.kafka.kafka_producer import KafkaProducer


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

    di[IKafkaProducer] = lambda _: KafkaProducer(
        host=settings.kafka_host,
        port=settings.kafka_port,
    )

    di["session_expire"] = 60 * 60 * 24 * 180  # 6 месяцев
    di["session_activate_expire"] = 60  # 1 минута
