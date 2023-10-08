import typing as tp

from api.utils.brokers.broker_factory import BrokerFactory
from api.utils.brokers.kafka.kafka_producer import KafkaProducer
from api.utils.brokers.kafka.consumers.kafka_consumer import KafkaConsumer
from settings import settings


class KafkaFactory(BrokerFactory):
    def create_producer(self, host: str, port: int, queue_name: str):
        return KafkaProducer(
            host=host,
            port=port,
            queue_name=queue_name,
        )

    def create_consumer(self, host: str, port: int, queue_name: str):
        return KafkaConsumer(
            host=host,
            port=port,
            queue_name=queue_name,
        )
