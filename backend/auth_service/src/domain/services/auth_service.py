import typing as tp

import random
import asyncio
import json
from kink import inject
from infrastructure.utils.ip import get_location_by_ip

from domain.exceptions.http_exception import HttpException
from domain.models.user import UserCreate, UserLoginConfirm, UserFingerPrint, UserLogin
from domain.services.user_service import UserService
from domain.services.session_service import SessionService
from domain.services.mail_service import MailService


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
        finger_print.user_location = await get_location_by_ip(finger_print.user_ip)
        new_user = await self._user_service.create_user(user_create)

        session_data = finger_print.model_dump()
        session_data["login_code"] = self._generate_code_for_login()

        new_session = await self._session_service.create_user_session(
            user_uuid=new_user,
            session_data=finger_print.model_dump(),
        )

        asyncio.create_task(
            self._mail_service.send_login_confirm_mail(user_create.email)
        )

        return new_session

    async def login_user(self, finger_print: UserFingerPrint, user_login: UserLogin):
        user = await self._user_service.find_user_by_phone(user_login.phone)
        if user is None:
            raise HttpException.not_found("user_not_found")

        session_data = finger_print.model_dump()
        session_data["login_code"] = self._generate_code_for_login()

        new_session = await self._session_service.create_user_session(
            user_uuid=user.user_id,
            session_data=finger_print.model_dump(),
        )

        asyncio.create_task(self._mail_service.send_login_confirm_mail(user.email))
        return new_session

    async def confirm_user_login(self, user_login_confirm: UserLoginConfirm) -> bool:
        user = await self._user_service.find_user_by_email(user_login_confirm.email)
        if user is None:
            raise HttpException.not_found("user_not_found")

        current_session = await self._session_service.get_user_session(
            session_key=user_login_confirm.session_key
        )

        if current_session is None:
            raise HttpException.not_found("session_not_found")

        session_data = dict(json.loads(current_session.data))
        login_code = int(session_data.get("login_code", None))
        if login_code != user_login_confirm.code:
            raise HttpException.bad_request("incorrect_code")

        session_data["is_active"] = True
        await self._session_service.update_user_session(
            session_key=current_session.session_key,
            new_session_data=session_data,
        )

        return session_data

    async def logout_user(self):
        ...

    def _generate_code_for_login(self) -> int:
        code = [random.randint(1, 9) for _ in range(5)]
        return int("".join(code))
