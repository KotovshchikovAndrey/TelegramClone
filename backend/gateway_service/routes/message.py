import typing as tp

from fastapi import (
    APIRouter,
    BackgroundTasks,
    HTTPException,
    Request,
    WebSocket,
    WebSocketDisconnect,
    status,
)
from fastapi.responses import StreamingResponse
from starlette.datastructures import MutableHeaders

from routes.auth import get_current_user
from utils import api_adapter_factory, kafka, websocket_manager

router = APIRouter(prefix="/messages")


@router.route("/{path:path}", methods=["GET", "POST"])
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


@router.websocket("/ws/{client_id:int}")
async def send_message(websocket: WebSocket, client_id: int):
    await websocket_manager.connect(f"{client_id}", websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        print("websocket error!")
        websocket_manager.disconnect(websocket)


@router.get("/kafka")
async def kafka_consumer():
    await kafka.send_message("new_test_topic", message="test")
    return 200
