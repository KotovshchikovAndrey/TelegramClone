import typing as tp

from fastapi import APIRouter, Depends, Request, Response, status
from kink import di

from domain.models.response import ConfirmLoginResponse
from domain.models.session import SessionActivation
from domain.models.user import (
    UserCreate,
    UserFingerPrint,
    UserInDB,
    UserLogin,
    UserPayload,
    UsersInfoGet,
)
from domain.services.auth_service import AuthService
from domain.services.user_service import UserService
from infrastructure.api.middlewares.auth_middleware import authenticate_current_user

router = APIRouter(prefix="/v1")


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(
    request: Request,
    service: tp.Annotated[AuthService, Depends(lambda: di[AuthService])],
    user_create: UserCreate,
):
    user_finger_print = UserFingerPrint(
        user_device=request.headers.get("User-Agent"),
        user_ip="2a00:1fa0:84ad:361f:2da5:2edb:3d14:966d",
    )

    session_key = await service.register_new_user(user_finger_print, user_create)
    return {"session_key": session_key}


@router.post("/login", status_code=status.HTTP_201_CREATED)
async def login_user(
    request: Request,
    service: tp.Annotated[AuthService, Depends(lambda: di[AuthService])],
    user_login: UserLogin,
):
    user_finger_print = UserFingerPrint(
        user_device=request.headers.get("User-Agent"),
        user_ip="2a00:1fa0:84ad:361f:2da5:2edb:3d14:966d",
    )

    session_key = await service.login_user(user_finger_print, user_login)
    return {"session_key": session_key}


@router.post(
    "/confirm-login",
    status_code=status.HTTP_200_OK,
    response_model=ConfirmLoginResponse,
)
async def confirm_user_login(
    service: tp.Annotated[AuthService, Depends(lambda: di[AuthService])],
    session_activation: SessionActivation,
):
    user, session_data = await service.confirm_user_login(session_activation)
    return {
        "user": user,
        "session_payload": session_data,
    }


@router.delete("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout_user(
    response: Response,
    service: tp.Annotated[AuthService, Depends(lambda: di[AuthService])],
    session_key: str,
):
    await service.logout_user(session_key)


@router.get("/authenticate", response_model=UserPayload)
async def authenticate_user(
    current_user: tp.Annotated[UserInDB, Depends(authenticate_current_user)],
):
    return current_user


@router.post("/get-users-info")
async def get_users_info(
    service: tp.Annotated[UserService, Depends(lambda: di[UserService])],
    users_info_get: UsersInfoGet,
):
    users_info = await service.get_users_info_by_uuids(users_info_get.user_uuids)
    return users_info
