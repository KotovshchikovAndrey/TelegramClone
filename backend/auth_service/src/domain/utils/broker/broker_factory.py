import typing as tp

from abc import abstractmethod, ABC
from domain.utils.broker.broker_producer import IBrokerProducer


class BrokerFactory(ABC):
    @abstractmethod
    def create_producer(self, host: str, port: int, queue_name: str) -> IBrokerProducer:
        ...
