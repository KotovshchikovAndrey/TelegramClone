from uuid import uuid4

from aiokafka import AIOKafkaProducer

from utils.kafka.kafka_interfaces import IKafkaProducer


class KafkaProducer(IKafkaProducer):
    _producer: AIOKafkaProducer

    def __init__(self, host: str, port: int, topic_name: str) -> None:
        self.port = port
        self.host = host
        self.topic_name = topic_name

    async def send_message(self, message: str, partition: int = 0):
        await self._producer.send_and_wait(
            topic=self.topic_name,
            value=message.encode(),
            partition=partition,
        )

        print("sended!")

    async def connect(self):
        self._producer = AIOKafkaProducer(
            bootstrap_servers=f"{self.host}:{self.port}",
            client_id=str(uuid4()),
        )

        await self._producer.start()

    async def disconect(self):
        await self._producer.stop()
