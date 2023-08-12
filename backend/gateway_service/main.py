import typing as tp

import uvicorn
from fastapi import FastAPI

from api.exceptions.handler import handle_error
from routes.auth import router as auth_router
from routes.messages import router as message_router
from settings import settings

# from api.utils.kafka import consumer, producer

app = FastAPI()
app.include_router(message_router)
app.include_router(auth_router)
app.add_exception_handler(Exception, handle_error)


@app.on_event("startup")
async def startup():
    ...
    # await producer.connect()
    # asyncio.create_task(consumer.connect())


@app.on_event("shutdown")
async def shutdown():
    ...
    # await producer.disconect()
    # await consumer.disconect()


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.server_host,
        port=settings.server_port,
        reload=True,
    )
