import asyncio
import typing as tp

from kink import inject

from domain.exceptions.http_exception import HttpException
from domain.models.session import SessionActivation
from domain.models.user import UserCreate, UserFingerPrint, UserLogin
from domain.services.mail_service import MailService
from domain.services.session_service import SessionService
from domain.services.user_service import UserService
from infrastructure.utils.ip import get_location_by_ip


@inject
class AuthService:
    _user_service: UserService
    _session_service: SessionService
    _mail_service: MailService

    def __init__(
        self,
        user_service: UserService,
        session_service: SessionService,
        mail_service: MailService,
    ) -> None:
        self._user_service = user_service
        self._session_service = session_service
        self._mail_service = mail_service

    async def register_new_user(
        self, finger_print: UserFingerPrint, user_create: UserCreate
    ):
        new_user = await self._user_service.create_user(user_create)
        finger_print.user_location = await get_location_by_ip(finger_print.user_ip)

        new_session = await self._session_service.create_user_session(
            user_uuid=new_user,
            payload=finger_print,
        )

        asyncio.create_task(
            self._mail_service.send_login_confirm_code(
                email=user_create.email,
                code=new_session.code,
            )
        )

        return new_session.session_key

    async def login_user(self, finger_print: UserFingerPrint, user_login: UserLogin):
        user = await self._user_service.find_user_by_phone(user_login.phone)
        if user is None:
            raise HttpException.not_found("user_not_found")

        finger_print.user_location = await get_location_by_ip(finger_print.user_ip)
        new_session = await self._session_service.create_user_session(
            user_uuid=user.user_uuid,
            payload=finger_print,
        )

        asyncio.create_task(
            self._mail_service.send_login_confirm_code(
                email=user.email,
                code=new_session.code,
            )
        )

        return new_session.session_key

    async def confirm_user_login(self, session_activation: SessionActivation):
        session_key = session_activation.session_key
        user_uuid = self._session_service.get_user_uuid_from_session_key(session_key)

        user = await self._user_service.get_user_by_uuid(user_uuid)
        if user is None:
            raise HttpException.not_found("user_not_found")

        session_data = await self._session_service.activate_user_session(
            session_key=session_key,
            activation_code=session_activation.code,
        )

        return user, session_data

    async def logout_user(self, session_key: str):
        await self._session_service.delete_user_session(session_key)

    async def authenticate_current_user(self, session_key: str):
        session = await self._session_service.get_user_session(session_key)
        if (session is None) or (not session.data.is_active):
            raise HttpException.unauthorized("unauthorized")

        user_uuid = self._session_service.get_user_uuid_from_session_key(session_key)
        current_user = await self._user_service.get_user_by_uuid(user_uuid)

        return current_user
