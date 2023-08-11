from uuid import uuid4

from aiokafka import AIOKafkaConsumer
from utils.kafka.kafka_interfaces import IKafkaConsumer


class KafkaConsumer(IKafkaConsumer):
    _consumer: AIOKafkaConsumer

    def __init__(self, host: str, port: int, topic_name: str, group_id: str) -> None:
        self.port = port
        self.host = host
        self.topic_name = topic_name
        self.group_id = group_id

    async def connect(self):
        self._consumer = AIOKafkaConsumer(
            self.topic_name,
            bootstrap_servers=f"{self.host}:{self.port}",
            group_id=self.group_id,
            client_id=str(uuid4()),
        )

        await self._consumer.start()
        await self._handle_message()

    async def disconect(self):
        await self._consumer.stop()

    async def _handle_message(self):
        print(111)
        async for msg in self._consumer:
            print(
                "consumed: ",
                msg.topic,
                msg.partition,
                msg.offset,
                msg.key,
                msg.value,
                msg.timestamp,
            )
