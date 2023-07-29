import typing as tp
from abc import abstractmethod

from domain.models.user import UserInDB, UserCreate

UserUUID: tp.TypeAlias = str


class IUserRepository(tp.Protocol):
    @abstractmethod
    async def get_user_by_uuid(self, user_uuid: str) -> UserInDB | None:
        ...

    @abstractmethod
    async def find_user_by_email(self, email: str) -> UserInDB | None:
        ...

    @abstractmethod
    async def find_user_by_phone(self, phone: str) -> UserInDB | None:
        ...

    @abstractmethod
    async def create_user(self, user_create: UserCreate) -> UserUUID:
        ...
