import typing as tp
import json
import httpx

from api.exceptions.api_exception import ApiException
from models.message import File


class GraphqlAdapter:
    _graphql_api_url: str

    def __init__(self, graphql_api_url: str) -> None:
        self._graphql_api_url = graphql_api_url

    async def send_query_json(
        self, query: str, headers: tp.Mapping[str, str] | None = None
    ):
        async with httpx.AsyncClient(base_url=self._graphql_api_url) as client:
            try:
                response = await client.post(
                    url="/",
                    json={"query": query},
                    headers=headers,
                )

                return response.json()

            except (httpx.TimeoutException, httpx.ConnectError):
                raise ApiException.service_unavailable(message="Service Unavailable!")

    async def send_query_form_data(
        self,
        operations: str,
        files: tp.List[File],
        headers: tp.Mapping[str, str] | None = None,
    ):
        files_map = {
            str(file_num): [f"variables.files.{file_num}"]
            for file_num in range(len(files))
        }

        files = {
            str(file_num): (file.filename, file.content)
            for file_num, file in enumerate(files)
        }

        async with httpx.AsyncClient(base_url=self._graphql_api_url) as client:
            try:
                response = await client.post(
                    url="/",
                    data={"operations": operations, "map": json.dumps(files_map)},
                    files=files,
                    headers=headers,
                )

                return response.json()

            except (httpx.TimeoutException, httpx.ConnectError):
                raise ApiException.service_unavailable(message="Service Unavailable!")
