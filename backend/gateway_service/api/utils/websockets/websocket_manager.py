import asyncio
import typing as tp

from fastapi import WebSocket


class WebSocketManager:
    _connections: tp.Dict[str, tp.List[WebSocket]]

    def __init__(self):
        self._connections = {}

    async def connect(self, channel_name: str, websocket: WebSocket):
        channel = self._connections.get(channel_name, None)
        if channel is None:
            self._connections[channel_name] = []

        await websocket.accept()
        self._connections[channel_name].append(websocket)

    def disconnect(self, channel_name: str, websocket: WebSocket):
        channel = self._connections.get(channel_name, None)
        if channel is not None:
            channel.remove(websocket)

    async def send_channel_message(self, channel_name: str, message: str):
        channel = self._connections.get(channel_name, None)
        if channel is None:
            return

        send_message_tasks = []
        for websocket in channel:
            task = asyncio.create_task(websocket.send_text(message))
            send_message_tasks.append(task)

        await asyncio.gather(*send_message_tasks)
