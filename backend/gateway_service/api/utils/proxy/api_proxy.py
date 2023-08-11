import typing as tp
from abc import abstractmethod

import httpx
from fastapi import Request
from httpx import AsyncClient, Response


class IApiProxy(tp.Protocol):
    @abstractmethod
    async def get_response(self, request: Request) -> Response | None:
        ...


class ApiProxy(IApiProxy):
    _client: AsyncClient

    def __init__(self, base_url: str) -> None:
        self._client = AsyncClient(base_url=base_url)

    async def get_response(self, request: Request):
        path = request.path_params["path"]
        url = httpx.URL(path=path, query=request.url.query.encode("utf-8"))
        api_request = self._client.build_request(
            method=request.method,
            url=url,
            headers=request.headers.raw,
            content=request.stream(),
        )

        try:
            api_response = await self._client.send(api_request, stream=True)
            return api_response
        except (httpx.TimeoutException, httpx.ConnectError):
            return None
