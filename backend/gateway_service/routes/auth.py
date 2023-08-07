import typing as tp

import httpx
from fastapi import APIRouter, BackgroundTasks, HTTPException, Request, status
from fastapi.responses import StreamingResponse

from models.user import CurrentUser
from utils import api_adapter_factory

router = APIRouter(prefix="/auth")


@router.route("/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def auth_api_proxy(request: Request):
    api_adapter = api_adapter_factory.get_api_adapter("auth")
    api_response = await api_adapter.get_response(request)

    return StreamingResponse(
        api_response.aiter_raw(),
        status_code=api_response.status_code,
        headers=api_response.headers,
        background=BackgroundTasks([api_response.aclose]),
    )


async def get_current_user(request: Request):
    user_session = request.headers.get("User-Session", None)
    if user_session is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    async with httpx.AsyncClient(base_url="http://127.0.0.1:8000/api/v1") as client:
        try:
            response = await client.get(
                "/authenticate",
                headers={"User-Session": user_session},
            )

            return CurrentUser(**response.json())
        except (httpx.TimeoutException, httpx.ConnectError):
            return None
