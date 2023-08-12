from fastapi import Request
from fastapi.responses import JSONResponse

from api.exceptions.api_exception import ApiException


async def handle_error(request: Request, exc: Exception):
    if isinstance(exc, ApiException):
        return JSONResponse(
            status_code=exc.status,
            content={"status": exc.status, "message": exc.message},
        )

    return JSONResponse(
        status_code=500,
        content={"status": 500, "message": None},
    )
