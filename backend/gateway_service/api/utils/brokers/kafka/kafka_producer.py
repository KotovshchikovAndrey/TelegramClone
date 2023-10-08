import typing as tp

from aiokafka import AIOKafkaProducer
from utils.brokers.broker_producer import IBrokerProducer


class KafkaProducer(IBrokerProducer):
    _host: str
    _port: int
    _queue_name: str

    _producer: AIOKafkaProducer

    def __init__(self, host: str, port: int, queue_name: str) -> None:
        self._host = host
        self._port = port
        self._queue_name = queue_name

    async def connect(self):
        broker_url = f"{self._host}:{self._port}"
        self._producer = AIOKafkaProducer(bootstrap_servers=broker_url)
        await self._producer.start()

    async def disconnect(self) -> None:
        await self._producer.stop()

    async def send_message(self, message: str):
        await self._producer.send_and_wait(
            topic=self._queue_name,
            value=message.encode(),
        )

        print("message sent!")
