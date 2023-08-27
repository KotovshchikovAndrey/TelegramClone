import random
import typing as tp
import uuid

from kink import inject

from domain.exceptions.http_exception import HttpException
from domain.models.session import (
    SessionActivation,
    SessionCreate,
    SessionData,
    SessionPayload,
)
from domain.repositories.session_repository import ISessionRepository


@inject
class SessionService:
    _session_expire: int
    _session_activate_expire: int
    _repository: ISessionRepository

    def __init__(
        self,
        session_expire: int,
        session_activate_expire: int,
        repository: ISessionRepository,
    ) -> None:
        self._session_expire = session_expire
        self._session_activate_expire = session_activate_expire
        self._repository = repository

    async def get_user_session(self, session_key: str):
        session = await self._repository.get_session(session_key)
        return session

    async def create_user_session(self, user_uuid: str, payload: SessionPayload):
        activation_code = self._generate_activation_code()
        session_data = SessionData(
            **payload.model_dump(),
            activation_code=activation_code,
            is_active=False,
        )

        session_create = SessionCreate(
            data=session_data,
            expire=self._session_activate_expire,
        )

        session_key = self._generate_session_key_for_user(user_uuid)
        new_session = await self._repository.create_session(session_key, session_create)

        return SessionActivation(code=activation_code, session_key=new_session)

    async def activate_user_session(self, session_key: str, activation_code: int):
        current_session = await self.get_user_session(session_key)
        if current_session is None:
            raise HttpException.not_found("session_not_found")

        session_data = current_session.data
        if session_data.activation_code != activation_code:
            raise HttpException.bad_request("incorrect_code")

        session_data.is_active = True
        session_create = SessionCreate(
            data=session_data,
            expire=self._session_expire,
        )

        session_key = await self._repository.create_session(
            session_key=session_key,
            session_create=session_create,
        )

        return session_data

    async def delete_user_session(self, session_key: str):
        await self._repository.delete_session(session_key)

    def get_user_uuid_from_session_key(self, session_key: str):
        user_uuid = session_key.split("_")[0]
        return user_uuid

    def _generate_session_key_for_user(self, user_uuid: str) -> str:
        session_uuid = str(uuid.uuid4())
        session_key = f"{user_uuid}_{session_uuid}"
        return session_key

    def _generate_activation_code(self) -> int:
        code = [str(random.randint(1, 9)) for _ in range(5)]
        return int("".join(code))
