import typing as tp

import json
from kink import inject
from redis.asyncio import Redis
from domain.models.session import SessionCreate, SessionInDB, SessionUpdate
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
        session = await self._redis.get(session_key)
        if session is not None:
            session_data = dict(json.loads(session))
            expire = await self._redis.ttl(session_key)

            return SessionInDB(data=session_data, expire=expire)

    async def update_session(
        self, session_key: str, new_session_data: tp.Dict[str, str]
    ):
        expire = await self._redis.ttl(session_key)
        session_create = SessionCreate(data=new_session_data, expire=expire)
        await self.create_session(session_key, session_create)

        return session_key

    async def delete_session(self, session_key: str):
        ...
