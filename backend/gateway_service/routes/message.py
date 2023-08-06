import typing as tp

from fastapi import APIRouter, BackgroundTasks, HTTPException, Request
from fastapi.responses import StreamingResponse
from routes import api_adapter_factory

router = APIRouter(prefix="/messages")


async def _reverse_proxy(request: Request):
    api_adapter = api_adapter_factory.get_api_adapter("message")
    if api_adapter is None:
        raise HTTPException(status_code=500, detail="Internal!")

    api_response = await api_adapter.get_response(request)
    return StreamingResponse(
        api_response.aiter_raw(),
        status_code=api_response.status_code,
        headers=api_response.headers,
        background=BackgroundTasks([api_response.aclose]),
    )


router.add_route("/message", _reverse_proxy, ["GET", "POST"])
