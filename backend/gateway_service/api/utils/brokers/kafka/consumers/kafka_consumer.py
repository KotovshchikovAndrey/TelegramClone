import typing as tp

from abc import ABC, abstractmethod
from aiokafka import AIOKafkaConsumer, ConsumerRecord
from api.utils.brokers.broker_consumer import IBrokerConsumer


class KafkaConsumer(ABC, IBrokerConsumer):
    _host: str
    _port: int
    _queue_name: str

    _consumer: AIOKafkaConsumer

    def __init__(self, host: str, port: int, queue_name: str) -> None:
        self._host = host
        self._port = port
        self._queue_name = queue_name

    async def connect(self):
        self._consumer = AIOKafkaConsumer(
            self._queue_name,
            bootstrap_servers=f"{self._host}:{self._port}",
            auto_offset_reset="earliest",
            enable_auto_commit=False,
            group_id=self._queue_name,
        )

        await self._consumer.start()
        while True:
            result = await self._consumer.getmany(timeout_ms=10 * 1000)
            print(result)
            for topic, messages in result.items():
                if messages:
                    await self._handle_messages(messages)
                    await self._consumer.commit({topic: messages[-1].offset + 1})
                    print("commited!")

    async def disconnect(self):
        await self._consumer.stop()

    @abstractmethod
    async def _handle_messages(self, messages: tp.List[ConsumerRecord]):
        ...


class ConversationMessageConsumer(KafkaConsumer):
    async def _handle_messages(self, messages: tp.List[ConsumerRecord]):
        for message in messages:
            print(
                "consumed: ",
                message.topic,
                message.partition,
                message.offset,
                message.key,
                message.value,
                message.timestamp,
            )
