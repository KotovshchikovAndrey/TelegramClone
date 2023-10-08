import typing as tp

from domain.utils.broker.broker_factory import BrokerFactory
from infrastructure.utils.kafka.kafka_producer import KafkaProducer
from infrastructure.config.settings import settings


class KafkaFactory(BrokerFactory):
    def create_producer(self, host: str, port: int, queue_name: str):
        return KafkaProducer(
            host=host,
            port=port,
            queue_name=queue_name,
        )
