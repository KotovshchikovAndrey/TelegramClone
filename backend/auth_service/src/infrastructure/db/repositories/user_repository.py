import typing as tp

from databases import Database
from kink import inject

from domain.models.user import UserCreate, UserInDB
from domain.repositories.user_repository import IUserRepository


@inject(alias=IUserRepository)
class PostgresUserRepository(IUserRepository):
    _postgres: Database

    def __init__(self, postgres: Database) -> None:
        self._postgres = postgres

    async def get_user_by_uuid(self, user_uuid: str):
        db_query = """SELECT * FROM "user" WHERE user_uuid = :user_uuid;"""
        user = await self._postgres.fetch_one(
            query=db_query,
            values={"user_uuid": user_uuid},
        )

        if user is not None:
            return UserInDB.model_validate(user)

    async def find_user_by_email(self, email: str):
        db_query = """SELECT * FROM "user" WHERE email = :email;"""
        user = await self._postgres.fetch_one(query=db_query, values={"email": email})
        if user is not None:
            return UserInDB.model_validate(user)

    async def find_user_by_phone(self, phone: str):
        db_query = """SELECT * FROM "user" WHERE phone = :phone;"""
        user = await self._postgres.fetch_one(query=db_query, values={"phone": phone})
        if user is not None:
            return UserInDB.model_validate(user)

    async def create_user(self, user_create: UserCreate):
        db_query = """
        INSERT INTO "user" (email, phone) 
        VALUES (
            :email,
            :phone
        ) RETURNING *;
        """

        new_user = await self._postgres.fetch_one(
            query=db_query,
            values=user_create.model_dump(exclude={"name", "surname"}),
        )

        return UserInDB.model_validate(new_user)
