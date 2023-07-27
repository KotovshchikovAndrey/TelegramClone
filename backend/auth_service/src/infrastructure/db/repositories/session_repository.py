import typing as tp

from kink import inject
from redis.asyncio import Redis
from domain.repositories.session_repository import ISessionRepository


@inject(alias=ISessionRepository)
class RedisSessionRepository(ISessionRepository):
    _redis: Redis

    def __init__(self, redis: Redis) -> None:
        self._redis = redis

    async def create_session(self):
        ...

    async def get_session(self, session_key: str):
        ...

    async def delete_session(self, session_key: str):
        ...
