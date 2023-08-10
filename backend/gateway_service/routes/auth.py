import typing as tp

from fastapi import APIRouter, BackgroundTasks, Request
from fastapi.responses import StreamingResponse

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
