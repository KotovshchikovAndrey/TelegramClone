import uvicorn

from kink import inject
from databases import Database

from infrastructure.config.server import FastApiServer
from infrastructure.config.settings import settings
from infrastructure.api import router


@inject
async def handle_startup(postgres: Database):
    await postgres.connect()


@inject
async def handle_shutdown(postgres: Database):
    await postgres.disconnect()


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
