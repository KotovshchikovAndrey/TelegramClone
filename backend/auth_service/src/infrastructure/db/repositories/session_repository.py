import asyncio
import json
import typing as tp

from kink import inject
from redis.asyncio import Redis

from domain.models.session import SessionCreate, SessionData, SessionInDB, SessionUpdate
from domain.repositories.session_repository import ISessionRepository


@inject(alias=ISessionRepository)
class RedisSessionRepository(ISessionRepository):
    _redis: Redis

    def __init__(self, redis: Redis) -> None:
        self._redis = redis

    async def get_session(self, session_key: str):
        session = await self._redis.get(session_key)
        if session is not None:
            session_value = dict(json.loads(session))
            session_expire = await self._redis.ttl(session_key)
            session_data = SessionData(**session_value["data"])

            return SessionInDB(
                session_key=session_key,
                data=session_data,
                expire=session_expire,
            )

    async def get_all_sessions(self, session_keys: tp.List[str]):
        sessions = await self._redis.mget(*session_keys)
        sessions_in_db = []
        for index, session in enumerate(sessions):
            session_key = session_keys[index]
            session_value = dict(json.loads(session))
            session_expire = await self._redis.ttl(session_key)
            session_data = SessionData(**session_value["data"])

            session_in_db = SessionInDB(
                session_key=session_key,
                data=session_data,
                expire=session_expire,
            )

            sessions_in_db.append(session_in_db)

        return sessions_in_db

    async def get_all_session_keys_by_part(self, session_key_part: str):
        session_keys = await self._redis.keys(f"{session_key_part}*")
        return session_keys

    async def create_session(self, session_key: str, session_create: SessionCreate):
        await self._redis.set(
            session_key,
            session_create.model_dump_json(),
            ex=session_create.expire,
        )

        return session_key

    async def update_session(self, session_key: str, session_update: SessionUpdate):
        session_key = await self.create_session(session_key, session_update)
        return session_key

    async def delete_session(self, session_key: str):
        await self._redis.delete(session_key)
        return session_key
