import json
import typing as tp

from fastapi import (
    APIRouter,
    BackgroundTasks,
    HTTPException,
    Request,
    WebSocket,
    WebSocketDisconnect,
    WebSocketException,
    status,
)
from fastapi.responses import StreamingResponse
from starlette.datastructures import MutableHeaders

from api.auth import get_current_user
from api.conversation import create_private_message
from models.message import PrivateMessageCreate
from utils import api_adapter_factory, websocket_manager

router = APIRouter(prefix="/messages")


@router.websocket("/ws/{channel_name:str}")
async def send_private_message(websocket: WebSocket, channel_name: str):
    user_session = websocket.headers.get("User-Session", None)
    if user_session is None:
        raise WebSocketException(code=status.HTTP_401_UNAUTHORIZED)

    current_user = await get_current_user(user_session)
    if current_user is None:
        raise WebSocketException(code=status.HTTP_401_UNAUTHORIZED)

    await websocket_manager.connect(channel_name, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            dto = PrivateMessageCreate(**data)

            api_response = await create_private_message(user_session, dto)
            await websocket_manager.send_channel_message(
                channel_name,
                message=json.dumps(api_response),
            )
    except WebSocketDisconnect:
        print("websocket error!")
        websocket_manager.disconnect(channel_name, websocket)


@router.route("/{path:path}", methods=["GET", "POST"])
async def message_api_proxy(request: Request):
    user_session = request.headers.get("User-Session", None)
    if user_session is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    current_user = await get_current_user(user_session)
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
