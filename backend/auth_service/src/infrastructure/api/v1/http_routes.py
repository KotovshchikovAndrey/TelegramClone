import typing as tp

from kink import di
from fastapi import APIRouter, Depends
from domain.services.auth_service import AuthService

router = APIRouter(prefix="/v1")


@router.get("/")
async def test(service: tp.Annotated[AuthService, Depends(lambda: di[AuthService])]):
    await service.register_new_user()
    return 200


# @router.post("/register")
# async def test(service: tp.Annotated[AuthService, Depends(lambda: di[AuthService])]):
#     await service.register_new_user()
#     return 200
