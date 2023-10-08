import typing as tp
from abc import abstractmethod


class IBrokerConsumer(tp.Protocol):
    @abstractmethod
    async def connect(self) -> None:
        ...

    @abstractmethod
    async def disconect(self) -> None:
        ...
