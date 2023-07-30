import typing as tp

from kink import di
from fastapi import APIRouter, Depends, Request, Response, status

from domain.models.user import UserCreate, UserFingerPrint, UserLogin
from domain.models.session import SessionLogin, SessionDataResponse, SessionKeyResponse
from domain.services.auth_service import AuthService

router = APIRouter(prefix="/v1")


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    response_model=SessionKeyResponse,
)
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


@router.post(
    "/login",
    status_code=status.HTTP_201_CREATED,
    response_model=SessionKeyResponse,
)
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
    response_model=SessionDataResponse,
)
async def confirm_user_login(
    service: tp.Annotated[AuthService, Depends(lambda: di[AuthService])],
    session_login: SessionLogin,
):
    session_data = await service.confirm_user_login(session_login)
    return session_data


@router.delete("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout_user(
    response: Response,
    service: tp.Annotated[AuthService, Depends(lambda: di[AuthService])],
    session_key: str,
):
    await service.logout_user(session_key)
