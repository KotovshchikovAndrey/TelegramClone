from __future__ import annotations

import typing as tp


class ApiException(Exception):
    status: int
    message: str

    def __init__(self, status: int, message: str) -> None:
        self.status = status
        self.message = message

    @classmethod
    def bad_request(cls: tp.Type[ApiException], message: str):
        return cls(status=400, message=message)

    @classmethod
    def unauthorized(cls: tp.Type[ApiException], message: str):
        return cls(status=401, message=message)

    @classmethod
    def service_unavailable(cls: tp.Type[ApiException], message: str):
        return cls(status=503, message=message)
