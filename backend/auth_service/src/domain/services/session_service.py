import typing as tp

import uuid
from kink import inject

from domain.models.user import UserBase
from domain.models.session import SessionCreate
from domain.repositories.session_repository import ISessionRepository


@inject
class SessionService:
    _repository: ISessionRepository

    def __init__(self, repository: ISessionRepository) -> None:
        self._repository = repository

    async def get_user_session(self):
        ...

    async def create_user_session(self, user: UserBase, session_create: SessionCreate):
        session_key = await self._generate_session_key_for_user(user_id=user.user_id)
        return await self._repository.create_session(session_key, session_create)

    async def delete_user_session(self):
        ...

    async def _generate_session_key_for_user(self, user_id: int) -> str:
        session_key = f"{user_id}_{uuid.uuid4()}"
        return session_key
