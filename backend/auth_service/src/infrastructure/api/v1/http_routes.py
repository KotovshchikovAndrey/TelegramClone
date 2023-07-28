import typing as tp

from kink import di
from fastapi import APIRouter, Depends

from domain.models.user import UserCreate
from domain.services.auth_service import AuthService

router = APIRouter(prefix="/v1")


@router.post("/register")
async def register_user(
    service: tp.Annotated[AuthService, Depends(lambda: di[AuthService])],
    user_create: UserCreate,
):
    session_key = await service.register_new_user(user_create)
    return session_key
