import asyncio
import json
import typing as tp

from fastapi import APIRouter, BackgroundTasks, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from pydantic import ValidationError
from starlette.datastructures import MutableHeaders

from api.auth import get_current_user
from api.conversations import (
    create_personal_message,
    get_all_conversations_for_current_user,
    set_message_status_for_current_user,
    update_message,
)
from api.exceptions.api_exception import ApiException
from api.utils import api_proxy_flyweight, websocket_manager
from models.message import (
    MessageAction,
    MessageUpdate,
    PersonalMessageCreate,
    UserMessageStatusUpdate,
)
from models.user import CurrentUser

router = APIRouter()


@router.websocket("/conversations/ws/{conversation_uuid:str}")
async def conversation_websocket_handler(websocket: WebSocket, conversation_uuid: str):
    await websocket_manager.connect(conversation_uuid, websocket)
    try:
        current_user = await _authenticate(websocket)
        while True:
            data = await websocket.receive_json()
            action = MessageAction(**data)

            api_response = await _dispatch_action(action, current_user)
            await websocket_manager.send_channel_message(
                channel_name=conversation_uuid,
                message=json.dumps(api_response),
            )

    except (ApiException, ValidationError) as exc:
        error_data = (
            {"status": exc.status, "message": exc.message}
            if isinstance(exc, ApiException)
            else {"status": 400, "message": exc.errors()}
        )

        await websocket_manager.send_personal_message(websocket, json.dumps(error_data))

    except WebSocketDisconnect:
        websocket_manager.disconnect(conversation_uuid, websocket)


@router.get("/conversations/sse/{stream_delay:int}")
async def conversation_sse_handler(request: Request, stream_delay: int):
    current_user = await _authenticate(request)
    if not (5 <= stream_delay <= 10):
        raise ApiException.bad_request(message="stream_delay must be between 5 and 10!")

    async def create_sse_stream(request: Request):
        while True:
            if await request.is_disconnected():
                break

            try:
                conversations = await get_all_conversations_for_current_user(
                    current_user=current_user
                )

                json_data = json.dumps(conversations)
                yield f"data:{json_data}\n\n"

            except ApiException as exc:
                exc_data = {
                    "status": exc.status,
                    "message": exc.message,
                }

                json_data = json.dumps(exc_data)
                yield f"data:{json_data}\n\n"

            await asyncio.sleep(stream_delay)

    response = StreamingResponse(
        create_sse_stream(request),
        media_type="text/event-stream",
    )

    response.headers["Cache-Control"] = "no-cache"
    return response


@router.route("/conversations/{path:path}", methods=["GET", "POST"])
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
    match action.action_type:
        case "create_personal_message":
            dto = PersonalMessageCreate(**action.data)
            return await create_personal_message(current_user, dto)
        case "update_message":
            dto = MessageUpdate(**action.data)
            return await update_message(current_user, dto)
        case "update_message_status_for_user":
            dto = UserMessageStatusUpdate(**action.data)
            return await set_message_status_for_current_user(current_user, dto)
        case _:
            raise ApiException.bad_request(message="Unexpected action_type!")
