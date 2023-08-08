from utils.kafka.kafka_consumer import KafkaConsumer
from utils.kafka.kafka_interfaces import IKafkaConsumer, IKafkaProducer
from utils.kafka.kafka_producer import KafkaProducer


class KafkaFactory:
    _host: str
    _port: int

    def __init__(self, host: str, port: int) -> None:
        self._host = host
        self._port = port

    def create_consumer(self, topic_name: str, group_id: str) -> IKafkaConsumer:
        consumer = KafkaConsumer(
            host=self._host,
            port=self._port,
            topic_name=topic_name,
            group_id=group_id,
        )

        return consumer

    def create_producer(self, topic_name: str) -> IKafkaProducer:
        producer = KafkaProducer(
            host=self._host,
            port=self._port,
            topic_name=topic_name,
        )

        return producer
