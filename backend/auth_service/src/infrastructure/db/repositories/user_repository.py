import typing as tp

from kink import inject
from databases import Database
from pydantic import UUID4

from domain.models.user import UserCreate, UserInDB, UserPublic
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

    async def get_users_info_by_uuids(self, user_uuids: tp.List[UUID4]):
        db_query = """
            SELECT user_uuid, name, surname, phone, avatar, about_me
            FROM "user"
            WHERE user_uuid IN %(uuids)s;
        """ % {
            "uuids": str(user_uuids).replace("[", "(").replace("]", ")")
        }

        users_info = await self._postgres.fetch_all(query=db_query)
        return [UserPublic.model_validate(user_info) for user_info in users_info]

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
        INSERT INTO "user" (name, surname, email, phone) 
        VALUES (
            :name,
            :surname,
            :email,
            :phone
        ) RETURNING user_uuid;
        """

        new_user = await self._postgres.execute(
            query=db_query,
            values=user_create.model_dump(),
        )

        return str(new_user)
