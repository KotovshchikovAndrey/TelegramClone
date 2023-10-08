import typing as tp
from abc import abstractmethod


class IBrokerProducer(tp.Protocol):
    @abstractmethod
    async def connect(self) -> None:
        ...

    @abstractmethod
    async def disconnect(self) -> None:
        ...

    @abstractmethod
    async def send_message(self, message: str):
        ...
