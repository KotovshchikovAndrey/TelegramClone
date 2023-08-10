import json

import httpx

from api.graphql import queries
from models.message import PrivateMessageCreate


async def create_private_message(user_session: str, dto: PrivateMessageCreate):
    async with httpx.AsyncClient(base_url="http://127.0.0.1") as client:
        operations = {
            "query": queries.create_message,
            "variables": {
                "dto": dto.model_dump(exclude="files"),
                "files": [None for _ in dto.files],
            },
        }

        files_map = {
            str(file_num): [f"variables.files.{file_num}"]
            for file_num in range(len(dto.files))
        }

        try:
            response = await client.post(
                url="/messages/graphql",
                headers={
                    "Apollo-Require-Preflight": "true",
                    "User-Session": user_session,
                },
                data={
                    "operations": json.dumps(operations),
                    "map": json.dumps(files_map),
                },
                files={str(file_num): file for file_num, file in enumerate(dto.files)},
            )

            return response.json()
        except (httpx.TimeoutException, httpx.ConnectError):
            return None
