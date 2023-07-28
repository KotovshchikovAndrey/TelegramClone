import typing as tp
from kink import inject

from domain.models.session import SessionCreate
from domain.models.user import UserCreate
from domain.services.user_service import UserService
from domain.services.session_service import SessionService


@inject
class AuthService:
    _user_service: UserService
    _session_service: SessionService

    def __init__(
        self, user_service: UserService, session_service: SessionService
    ) -> None:
        self._user_service = user_service
        self._session_service = session_service

    async def register_new_user(self, user_create: UserCreate):
        new_user = await self._user_service.create_user(user_create)

        session_expire = 60
        session_data = {
            "device": "test_device",
            "location": "test_location",
            "ip": "test_ip",
        }

        session_create = SessionCreate(data=session_data, expire=session_expire)
        user_session = await self._session_service.create_user_session(
            user_uuid=new_user, session_create=session_create
        )

        return user_session

    async def login_user(self):
        ...

    async def logout_user(self):
        ...
