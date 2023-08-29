from redis import Redis
import uvicorn
from databases import Database
from kink import inject

from infrastructure.api import router
from infrastructure.config.server import FastApiServer
from infrastructure.config.settings import settings


@inject
async def handle_startup(postgres: Database):
    await postgres.connect()


@inject
async def handle_shutdown(postgres: Database, redis: Redis):
    await postgres.disconnect()
    await redis.close()


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
