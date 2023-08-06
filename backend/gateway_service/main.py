import typing as tp

import uvicorn
from fastapi import FastAPI, HTTPException, Request, status

from routes.message import router as message_router
from routes.auth import router as auth_router

app = FastAPI()
app.include_router(message_router)
app.include_router(auth_router)


# @app.middleware("http")
# async def reverse_proxy(request: Request, call_next: tp.Callable):
#     request_path = request.url.path
#     if request_path.startswith("/auth"):
#         request.url.replace(path=request_path[5:])  # clear prefix /auth
#         return await auth_api_handler(request)

#     raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY)


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=80, reload=True)
