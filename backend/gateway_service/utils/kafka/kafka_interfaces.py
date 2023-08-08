import typing as tp
from abc import abstractmethod


class IKafkaConsumer(tp.Protocol):
    @abstractmethod
    async def connect(self) -> None:
        ...

    @abstractmethod
    async def disconect(self) -> None:
        ...


class IKafkaProducer(tp.Protocol):
    @abstractmethod
    async def send_message(self, message: str, partition: int = 0) -> None:
        ...

    @abstractmethod
    async def connect(self) -> None:
        ...

    @abstractmethod
    async def disconect(self) -> None:
        ...
