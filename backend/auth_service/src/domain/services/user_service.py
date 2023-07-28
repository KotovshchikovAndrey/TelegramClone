import typing as tp

from kink import inject
from domain.models.user import UserCreate
from domain.repositories.user_repository import IUserRepository
from domain.exceptions.http_exception import HttpException


@inject
class UserService:
    _repository: IUserRepository

    def __init__(self, repository: IUserRepository) -> None:
        self._repository = repository

    async def create_user(self, user_create: UserCreate):
        user = await self._repository.find_user_by_phone(user_create.phone)
        if user is not None:
            raise HttpException.bad_request(message="user_phone_occupied")

        user = await self._repository.find_user_by_email(user_create.email)
        if user is not None:
            raise HttpException.bad_request(message="user_email_occupied")

        new_user = await self._repository.create_user(user_create)
        return new_user
