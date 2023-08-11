import typing as tp

from fastapi import APIRouter, BackgroundTasks, HTTPException, Request, status
from fastapi.responses import StreamingResponse

from api.utils import api_proxy_flyweight

router = APIRouter()


@router.route("/auth/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def auth_api_proxy(request: Request):
    api_proxy = api_proxy_flyweight.get_api_proxy("auth")
    api_response = await api_proxy.get_response(request)
    if api_response is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE)

    return StreamingResponse(
        api_response.aiter_raw(),
        status_code=api_response.status_code,
        headers=api_response.headers,
        background=BackgroundTasks([api_response.aclose]),
    )
