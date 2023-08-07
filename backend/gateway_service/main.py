import typing as tp

import uvicorn
from fastapi import FastAPI

from routes.auth import router as auth_router
from routes.message import router as message_router
from utils import kafka

app = FastAPI()
app.include_router(message_router)
app.include_router(auth_router)


@app.on_event("startup")
async def startup():
    await kafka.connect()


@app.on_event("shutdown")
async def shutdown():
    await kafka.disconect()


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=80, reload=True)
