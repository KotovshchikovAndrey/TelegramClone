import typing as tp

import uvicorn
from fastapi import FastAPI

from api.exceptions.handler import handle_error
from routes.auth import router as auth_router
from routes.conversations import router as message_router
from settings import settings


app = FastAPI()
app.include_router(auth_router)
app.include_router(message_router)
app.add_exception_handler(Exception, handle_error)


@app.on_event("startup")
async def startup():
    ...


@app.on_event("shutdown")
async def shutdown():
    ...


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.server_host,
        port=settings.server_port,
        reload=True,
    )
