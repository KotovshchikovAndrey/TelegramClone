import asyncio
import typing as tp

from fastapi import WebSocket


class WebSocketManager:
    _connections: tp.Dict[str, tp.List[WebSocket]]

    def __init__(self):
        self._connections = {}

    async def connect(self, room_name: str, websocket: WebSocket):
        room = self._connections.get(room_name, None)
        if room is None:
            self._connections[room_name] = []

        await websocket.accept()
        self._connections[room_name].append(websocket)

    def disconnect(self, room_name: str, websocket: WebSocket):
        room = self._connections[room_name]
        room.remove(websocket)

    async def send_room_message(self, room_name: str, message: str):
        room_websockets = self._connections[room_name]
        send_message_tasks = []
        for websocket in room_websockets:
            task = asyncio.create_task(websocket.send_text(message))
            send_message_tasks.append(task)

        await asyncio.gather(*send_message_tasks)
