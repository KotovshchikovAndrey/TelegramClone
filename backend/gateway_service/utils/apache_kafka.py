# import asyncio
from aiokafka import AIOKafkaProducer


class KafkaClient:
    _producer: AIOKafkaProducer

    def __init__(self, host: str, port: int) -> None:
        self.port = port
        self.host = host

    async def send_message(self, topic_name: str, message: str, partition: int = 0):
        await self._producer.send_and_wait(
            topic=topic_name,
            value=message.encode(),
            partition=partition,
        )

        print("sended!")

    async def connect(self):
        self._producer = AIOKafkaProducer(bootstrap_servers=f"{self.host}:{self.port}")
        await self._producer.start()

    async def disconect(self):
        await self._producer.stop()
