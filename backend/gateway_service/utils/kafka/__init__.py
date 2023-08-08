from settings import settings
from utils.kafka.kafka_factory import KafkaFactory

kafka_factory = KafkaFactory(host=settings.kafka_host, port=settings.kafka_port)
producer = kafka_factory.create_producer(topic_name=settings.kafka_producer_topic)
consumer = kafka_factory.create_consumer(
    topic_name=settings.kafka_consumer_topic,
    group_id=settings.kafka_group_id,
)
