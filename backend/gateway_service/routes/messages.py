import json
import typing as tp
from fastapi.responses import StreamingResponse

from starlette.datastructures import MutableHeaders
from fastapi import APIRouter, BackgroundTasks, Request, WebSocket, WebSocketDisconnect

from api.auth import get_current_user
from api.exceptions.api_exception import ApiException
from api.conversation import create_personal_message, update_personal_message
from api.utils import websocket_manager, api_proxy_flyweight
from models.user import CurrentUser
from models.message import PersonalMessageCreate, PersonalMessageUpdate, MessageAction

router = APIRouter()


@router.websocket("/messages/ws/{channel_name:str}")
async def send_private_message(websocket: WebSocket, channel_name: str):
    await websocket_manager.connect(channel_name, websocket)
    try:
        current_user = await _authenticate(websocket)
        while True:
            data = await websocket.receive_json()
            print(data)
            action = MessageAction(**data)

            api_response = await _dispatch_action(action, current_user)
            print(api_response)
            await websocket_manager.send_channel_message(
                channel_name,
                message=json.dumps(api_response),
            )

    except ApiException as exc:
        error_data = {"status": exc.status, "message": exc.message}
        await websocket_manager.send_personal_message(websocket, json.dumps(error_data))
        websocket_manager.disconnect(channel_name, websocket)

    except WebSocketDisconnect:
        websocket_manager.disconnect(channel_name, websocket)


@router.route("/messages/read/{path:path}", methods=["GET", "POST"])
async def message_api_proxy(request: Request):
    current_user = await _authenticate(request)

    headers = MutableHeaders(request._headers)
    headers["Authorizer"] = current_user.model_dump_json()
    request._headers = headers

    api_proxy = api_proxy_flyweight.get_api_proxy("messages")
    api_response = await api_proxy.get_response(request)

    return StreamingResponse(
        api_response.aiter_raw(),
        status_code=api_response.status_code,
        headers=api_response.headers,
        background=BackgroundTasks([api_response.aclose]),
    )


async def _authenticate(client: WebSocket | Request) -> CurrentUser:
    user_session = client.headers.get("User-Session", None)
    if user_session is None:
        raise ApiException.unauthorized(message="Unauthorized!")

    current_user = await get_current_user(user_session)
    if current_user is None:
        raise ApiException.unauthorized(message="Unauthorized!")

    return current_user


async def _dispatch_action(action: MessageAction, current_user: CurrentUser):
    if action.action_type == "send_personal_message":
        dto = PersonalMessageCreate(**action.data)
        api_response = await create_personal_message(current_user, dto)
    elif action.action_type == "update_personal_message":
        dto = PersonalMessageUpdate(**action.data)
        api_response = await update_personal_message(current_user, dto)
    else:
        raise ApiException.bad_request(message="Unexpected action_type!")

    return api_response
