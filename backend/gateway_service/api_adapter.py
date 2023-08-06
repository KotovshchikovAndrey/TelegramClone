import typing as tp

import httpx
from abc import abstractmethod
from httpx import AsyncClient, Response
from fastapi import Request


class IApiAdapter(tp.Protocol):
    @abstractmethod
    async def get_response(self, request: Request) -> Response:
        ...


class ApiAdapter(IApiAdapter):
    _client: AsyncClient

    def __init__(self, base_url: str) -> None:
        self._client = AsyncClient(base_url=base_url)

    async def get_response(self, request: Request):
        url = httpx.URL(path=request.url.path, query=request.url.query.encode("utf-8"))
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
            "message": ApiAdapter(base_url="http://127.0.0.1:3000/graphql"),
        }

    def get_api_adapter(self, name: str) -> IApiAdapter | None:
        api_adapter = self._adapters.get(name, None)
        return api_adapter
