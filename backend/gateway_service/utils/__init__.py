from utils.apache_kafka import KafkaClient
from utils.api_adapter import ApiAdapterFactory
from utils.websocket_manager import WebSocketManager

api_adapter_factory = ApiAdapterFactory()
websocket_manager = WebSocketManager()
kafka = KafkaClient(host="localhost", port=19092)
