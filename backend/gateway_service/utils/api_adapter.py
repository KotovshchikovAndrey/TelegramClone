import typing as tp
from abc import abstractmethod

import httpx
from fastapi import Request
from httpx import AsyncClient, Response

from settings import settings


class IApiAdapter(tp.Protocol):
    @abstractmethod
    async def get_response(self, request: Request) -> Response:
        ...


class ApiAdapter(IApiAdapter):
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

        api_response = await self._client.send(api_request, stream=True)
        return api_response


class ApiAdapterFactory:
    _adapters: tp.Dict[str, IApiAdapter]

    def __init__(self) -> None:
        self._adapters = {
            "message": ApiAdapter(base_url=settings.conservation_service_host),
            "auth": ApiAdapter(base_url=settings.auth_service_host),
        }

    def get_api_adapter(self, name: str) -> IApiAdapter:
        api_adapter = self._adapters[name]
        return api_adapter
