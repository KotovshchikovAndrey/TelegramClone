import typing as tp
from abc import abstractmethod


class IKafkaProducer(tp.Protocol):
    @abstractmethod
    async def send_message(
        self,
        topic_name: str,
        message: str,
        partition: int = 0,
    ) -> None:
        ...

    @abstractmethod
    async def connect(self) -> None:
        ...

    @abstractmethod
    async def disconect(self) -> None:
        ...
