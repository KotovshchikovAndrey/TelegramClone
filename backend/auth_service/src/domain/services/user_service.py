import typing as tp
from kink import inject

from domain.repositories.user_repository import IUserRepository
from domain.exceptions.http_exception import HttpException
from domain.models.user import (
    UserCreate,
    UserInDB,
    ProfileUpdate,
    UserAvatar,
    ProfilePublic,
)


@inject
class UserService:
    _repository: IUserRepository

    def __init__(self, repository: IUserRepository) -> None:
        self._repository = repository

    async def get_user_profile(self, user_uuid: str):
        user = await self._repository.get_user_by_uuid(user_uuid)
        if user is None:
            raise HttpException("user_not_found")

        return ProfilePublic.model_validate(user)

    async def set_user_avatar(self, user_uuid: str, avatar: UserAvatar):
        ...

    async def update_user_profile(self, profile_update: ProfileUpdate):
        ...

    async def create_user(self, user_create: UserCreate):
        user = await self._repository.find_user_by_phone(user_create.phone)
        if user is not None:
            raise HttpException.bad_request(message="user_phone_occupied")

        user = await self._repository.find_user_by_email(user_create.email)
        if user is not None:
            raise HttpException.bad_request(message="user_email_occupied")

        new_user = await self._repository.create_user(user_create)
        return new_user

    async def get_user_by_uuid(self, user_uuid: str):
        user = await self._repository.get_user_by_uuid(user_uuid)
        return user

    async def find_user_by_phone(self, phone: str) -> tp.Optional[UserInDB]:
        user = await self._repository.find_user_by_phone(phone)
        return user

    async def find_user_by_email(self, email: str) -> tp.Optional[UserInDB]:
        user = await self._repository.find_user_by_email(email)
        return user
