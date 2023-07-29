import typing as tp

import hashlib
from kink import inject

from domain.models.session import SessionCreate, SessionData, SessionPayload
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

    async def create_user_session(self, user_uuid: str, session_data: SessionData):
        session_payload = SessionPayload(**session_data.model_dump())
        session_key = self._generate_session_key_for_user(user_uuid, session_payload)
        session_create = SessionCreate(data=session_data, expire=self._session_expire)
        new_session = await self._repository.create_session(session_key, session_create)

        return new_session

    async def update_user_session(
        self, session_key: str, new_session_data: SessionData
    ):
        updated_session = await self._repository.update_session(
            session_key=session_key,
            new_session_data=new_session_data,
        )

        return updated_session

    async def delete_user_session(self, session_key: str):
        await self._repository.delete_session(session_key)

    def get_user_uuid_from_session_key(self, session_key: str):
        user_uuid = session_key.split("_")[0]
        return user_uuid

    def _generate_session_key_for_user(
        self, user_uuid: str, finger_print: SessionPayload
    ) -> str:
        finger_print_hash = hashlib.sha256(finger_print.model_dump_json().encode())
        session_key = f"{user_uuid}_{finger_print_hash.hexdigest()}"
        return session_key
