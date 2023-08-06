import typing as tp

from starlette.datastructures import MutableHeaders
from fastapi import APIRouter, BackgroundTasks, HTTPException, Request, status
from fastapi.responses import StreamingResponse

from routes.auth import get_current_user
from routes import api_adapter_factory

router = APIRouter()


@router.route("/messages/{path:path}", methods=["GET", "POST"])
async def message_api_proxy(request: Request):
    current_user = await get_current_user(request)
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    headers = MutableHeaders(request._headers)
    headers["Authorizer"] = current_user.model_dump_json()
    request._headers = headers

    api_adapter = api_adapter_factory.get_api_adapter("message")
    api_response = await api_adapter.get_response(request)

    return StreamingResponse(
        api_response.aiter_raw(),
        status_code=api_response.status_code,
        headers=api_response.headers,
        background=BackgroundTasks([api_response.aclose]),
    )
