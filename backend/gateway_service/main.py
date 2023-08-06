import typing as tp

import uvicorn
from fastapi import FastAPI
from routes.message import router as message_router

app = FastAPI()
app.include_router(message_router)


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=80, reload=True)
