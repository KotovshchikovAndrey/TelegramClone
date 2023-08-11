import json
import typing as tp

from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect,
    WebSocketException,
    status,
)

from api.auth import get_current_user
from api.conversation import create_personal_message, update_personal_message
from api.utils import websocket_manager
from models.message import PersonalMessageCreate, PersonalMessageUpdate

router = APIRouter()


@router.websocket("/messages/ws/{channel_name:str}")
async def send_private_message(websocket: WebSocket, channel_name: str):
    user_session = websocket.headers.get("User-Session", None)
    if user_session is None:
        raise WebSocketException(status_code=status.HTTP_401_UNAUTHORIZED)

    current_user = await get_current_user(user_session)
    if current_user is None:
        raise WebSocketException(status_code=status.HTTP_401_UNAUTHORIZED)

    await websocket_manager.connect(channel_name, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            dto = PersonalMessageCreate(**data)
            api_response = await create_personal_message(current_user, dto)

            await websocket_manager.send_channel_message(
                channel_name,
                message=json.dumps(api_response),
            )

            # dto = PersonalMessageUpdate(**data)
            # api_response = await update_personal_message(current_user, dto)

            # await websocket_manager.send_channel_message(
            #     channel_name,
            #     message=json.dumps(api_response),
            # )

    except WebSocketDisconnect:
        print("websocket error!")
        websocket_manager.disconnect(channel_name, websocket)


# @router.route("/messages/{path:path}", methods=["GET", "POST"])
# async def message_api_proxy(request: Request):
#     user_session = request.headers.get("User-Session", None)
#     if user_session is None:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

#     current_user = await get_current_user(user_session)
#     if current_user is None:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

#     headers = MutableHeaders(request._headers)
#     headers["Authorizer"] = current_user.model_dump_json()
#     request._headers = headers

#     api_proxy = api_proxy_flyweight.get_api_proxy("message")
#     api_response = await api_proxy.get_response(request)
#     if api_response is None:
#         raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE)

#     return StreamingResponse(
#         api_response.aiter_raw(),
#         status_code=api_response.status_code,
#         headers=api_response.headers,
#         background=BackgroundTasks([api_response.aclose]),
#     )
