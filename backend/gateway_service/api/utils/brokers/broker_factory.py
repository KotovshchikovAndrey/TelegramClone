import typing as tp
from abc import ABC, abstractmethod

from api.utils.brokers.broker_consumer import IBrokerConsumer
from api.utils.brokers.broker_producer import IBrokerProducer


class BrokerFactory(ABC):
    @abstractmethod
    def create_producer(self, host: str, port: int, queue_name: str) -> IBrokerProducer:
        ...

    @abstractmethod
    def create_consumer(self, host: str, port: int, queue_name: str) -> IBrokerConsumer:
        ...
