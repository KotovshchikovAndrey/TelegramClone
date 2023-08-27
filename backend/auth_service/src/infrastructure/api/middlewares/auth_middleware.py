import typing as tp

from fastapi import Depends, Header
from kink import di

from domain.exceptions.http_exception import HttpException
from domain.models.user import UserInDB
from domain.services.auth_service import AuthService


async def authenticate_current_user(
    auth_service: tp.Annotated[AuthService, Depends(lambda: di[AuthService])],
    user_session: tp.Optional[str] = Header(None),
) -> UserInDB:
    # ONLY DEV!
    # if access_token == "boss":
    #     boss_of_this_gym = UserInDB(
    #         email="admin@gmail.com",
    #         name="Boss",
    #         surname="Bossovich",
    #         password="ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f",
    #     )

    #     return boss_of_this_gym

    if user_session is None:
        raise HttpException.bad_request(message="session_not_transferred")

    current_user = await auth_service.authenticate_current_user(user_session)
    if current_user is None:
        raise HttpException.unauthorized(message="unauthorized")

    return current_user
