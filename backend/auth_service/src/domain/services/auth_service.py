import typing as tp
from kink import inject

from domain.exceptions.http_exception import HttpException
from domain.models.session import SessionActivation
from domain.models.user import UserCreate, UserFingerPrint, UserLogin, UserPublic

from domain.services.session_service import SessionService
from domain.services.user_service import UserService
from domain.utils.broker.broker_producer import IBrokerProducer
from infrastructure.utils.celery.tasks import send_login_code_email
from infrastructure.utils.ip import get_location_by_ip


@inject
class AuthService:
    _user_service: UserService
    _session_service: SessionService
    _broker_producer: IBrokerProducer

    def __init__(
        self,
        user_service: UserService,
        session_service: SessionService,
        broker_producer: IBrokerProducer,
    ) -> None:
        self._user_service = user_service
        self._session_service = session_service
        self._broker_producer = broker_producer

    async def register_new_user(
        self, finger_print: UserFingerPrint, user_create: UserCreate
    ):
        new_user = await self._user_service.create_user(user_create)
        finger_print.user_location = await get_location_by_ip(finger_print.user_ip)
        new_session = await self._session_service.create_user_session(
            user_uuid=new_user.user_uuid,
            payload=finger_print,
        )

        user_public = UserPublic(
            **new_user.model_dump(),
            name=user_create.name,
            surname=user_create.surname,
        )

        await self._broker_producer.send_message(message=user_public.model_dump_json())
        send_login_code_email.delay(new_user.email, new_session.code)

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

        send_login_code_email.delay(user.email, new_session.code)
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
