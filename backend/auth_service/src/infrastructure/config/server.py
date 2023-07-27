from __future__ import annotations
import typing as tp

from fastapi import FastAPI, Request


class FastApiServer:
    _instance: tp.Optional[FastApiServer] = None

    _startup_handler: tp.Optional[tp.Callable]
    _shutdown_handler: tp.Optional[tp.Callable]
    _is_debug: bool

    def __new__(cls, *args: tp.Any, **kwargs: tp.Any):
        if cls._instance is None:
            cls._instance = super().__new__(cls)

        return cls._instance

    def __init__(
        self,
        startup_handler: tp.Optional[tp.Callable] = None,
        shutdown_handler: tp.Optional[tp.Callable] = None,
        is_debug: bool = False,
    ) -> None:
        self._startup_handler = startup_handler
        self._shutdown_handler = shutdown_handler
        self._is_debug = is_debug

    def create_app(self) -> FastAPI:
        app = FastAPI(debug=self._is_debug)
        app.add_exception_handler(Exception, self._handle_error)

        if self._startup_handler is not None:
            app.add_event_handler("startup", self._startup_handler)

        if self._shutdown_handler is not None:
            app.add_event_handler("shutdown", self._shutdown_handler)

        return app

    async def _handle_error(self, request: Request, exc: Exception):
        ...
