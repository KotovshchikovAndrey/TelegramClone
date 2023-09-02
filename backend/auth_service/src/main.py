import uvicorn
from databases import Database
from kink import inject
from redis import Redis

from infrastructure.api import router
from infrastructure.config.server import FastApiServer
from infrastructure.config.settings import settings
from infrastructure.utils.kafka.kafka_interfaces import IKafkaProducer


@inject
async def handle_startup(postgres: Database, kafka_producer: IKafkaProducer):
    await postgres.connect()
    await kafka_producer.connect()


@inject
async def handle_shutdown(
    postgres: Database,
    redis: Redis,
    kafka_producer: IKafkaProducer,
):
    await postgres.disconnect()
    await redis.close()
    await kafka_producer.disconect()


server = FastApiServer(startup_handler=handle_startup, shutdown_handler=handle_shutdown)
app = server.create_app()
app.include_router(router)


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.server_host,
        port=settings.server_port,
        reload=True,
    )
