import redis.asyncio as aioredis
from redis.asyncio import Redis


def get_redis_connection(host: str, port: str, password: str) -> Redis:
    redis = aioredis.from_url(
        f"redis://{host}:{port}",
        password=password,
        decode_responses=True,
    )

    return redis
