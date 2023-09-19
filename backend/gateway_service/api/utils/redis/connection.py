import redis.asyncio as aioredis
from redis.asyncio import Redis


class RedisClient:
    _host: str
    _port: int
    _username: str
    _password: str

    _redis: Redis

    def __init__(self, host: str, port: int, username: str, password: str) -> None:
        self._host = host
        self._port = port
        self._username = username
        self._password = password

    async def connect(self) -> None:
        self._redis = await aioredis.from_url(
            url=f"{self._host}:{self._port}",
            username=self._username,
            password=self._password,
            decode_responses=True,
        )

    async def disconnect(self) -> None:
        await self._redis.close()

    async def get_value(self, key: str) -> str:
        value = await self._redis.get(key)
        return value

    async def set_value(self, key: str, value: str) -> None:
        await self._redis.set(key, value)

    async def remove_value(self, key: str) -> None:
        await self._redis.delete(key)
