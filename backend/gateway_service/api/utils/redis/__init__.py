from settings import settings

from .connection import RedisClient

redis_client = RedisClient(
    host=settings.redis_host,
    port=settings.redis_port,
    username=settings.redis_username,
    password=settings.redis_password,
)
