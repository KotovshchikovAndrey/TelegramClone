import typing as tp

import uuid
import random
from kink import inject

from domain.models.user import UserBase
from domain.models.session import SessionCreate, SessionInDB
from domain.repositories.session_repository import ISessionRepository


@inject
class SessionService:
    _session_expire: int
    _repository: ISessionRepository

    def __init__(self, session_expire: int, repository: ISessionRepository) -> None:
        self._session_expire = session_expire
        self._repository = repository

    async def get_user_session(self, session_key: str):
        session = await self._repository.get_session(session_key)
        return session

    async def create_user_session(
        self, user_uuid: str, session_data: tp.Dict[str, str]
    ):
        session_key = self._generate_session_key_for_user(user_uuid)
        session_create = SessionCreate(data=session_data, expire=self._session_expire)
        new_session = await self._repository.create_session(session_key, session_create)

        return new_session

    async def update_user_session(
        self, session_key: str, new_session_data: tp.Dict[str, str]
    ):
        updated_session = await self._repository.update_session()

    async def delete_user_session(self):
        ...

    def _generate_session_key_for_user(self, user_uuid: str) -> str:
        session_key = f"{user_uuid}_{uuid.uuid4()}"
        return session_key
