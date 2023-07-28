import typing as tp

import json
from kink import inject
from redis.asyncio import Redis
from domain.models.session import SessionCreate
from domain.repositories.session_repository import ISessionRepository


@inject(alias=ISessionRepository)
class RedisSessionRepository(ISessionRepository):
    _redis: Redis

    def __init__(self, redis: Redis) -> None:
        self._redis = redis

    async def create_session(self, session_key: str, session_create: SessionCreate):
        await self._redis.set(
            session_key,
            json.dumps(session_create.data),
            ex=session_create.expire,
        )

        return session_key

    async def get_session(self, session_key: str):
        ...

    async def delete_session(self, session_key: str):
        ...
