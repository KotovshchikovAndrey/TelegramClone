import typing as tp
from kink import inject

from domain.models.user import UserCreate
from domain.services.session_service import SessionService


@inject
class AuthService:
    _session_service: SessionService

    def __init__(self, session_service: SessionService) -> None:
        self._session_service = session_service

    async def register_new_user(self, user_create: UserCreate):
        await self._session_service.create_user_session()

    async def login_user(self):
        ...

    async def logout_user(self):
        ...
