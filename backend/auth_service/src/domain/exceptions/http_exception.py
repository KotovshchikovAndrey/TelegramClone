from __future__ import annotations

import typing as tp


class HttpException(Exception):
    status: int
    message: tp.Optional[str]

    def __init__(self, status: int, message: tp.Optional[str]) -> None:
        self.status = status
        self.message = message

    @classmethod
    def bad_request(
        cls: tp.Type[HttpException], message: tp.Optional[str] = None
    ) -> HttpException:
        return cls(status=400, message=message)

    @classmethod
    def unauthorized(
        cls: tp.Type[HttpException], message: tp.Optional[str] = None
    ) -> HttpException:
        return cls(status=401, message=message)

    @classmethod
    def not_found(
        cls: tp.Type[HttpException], message: tp.Optional[str] = None
    ) -> HttpException:
        return cls(status=404, message=message)

    @classmethod
    def forbidden(
        cls: tp.Type[HttpException], message: tp.Optional[str] = None
    ) -> HttpException:
        return cls(status=403, message=message)
