import json
import typing as tp

import httpx

from api.graphql import queries
from api.utils.adapters.graphql_adapter import GraphqlAdapter
from models.message import PersonalMessageCreate, PersonalMessageUpdate
from models.user import CurrentUser
from settings import settings


async def create_personal_message(
    current_user: CurrentUser, dto: PersonalMessageCreate
):
    headers = {
        "Apollo-Require-Preflight": "true",
        "Authorizer": current_user.model_dump_json(),
    }

    adapter = GraphqlAdapter(graphql_api_url=settings.conservation_service_host)
    if dto.files:
        operations = {
            "query": queries.create_message_with_files,
            "variables": {
                "dto": dto.model_dump(exclude="files"),
                "files": [None for _ in dto.files],
            },
        }

        response = await adapter.send_query_form_data(
            operations=json.dumps(operations),
            files=dto.files,
            headers=headers,
        )

        return response

    mutation = queries.create_message_without_files % dto.model_dump()
    response = await adapter.send_query_json(query=mutation, headers=headers)

    return response


async def update_personal_message(
    current_user: CurrentUser, dto: PersonalMessageUpdate
):
    headers = {
        "Apollo-Require-Preflight": "true",
        "Authorizer": current_user.model_dump_json(),
    }

    adapter = GraphqlAdapter(graphql_api_url=settings.conservation_service_host)
    if dto.files:
        operations = {
            "query": queries.update_message_with_files,
            "variables": {
                "dto": dto.model_dump(exclude="files"),
                "files": [None for _ in dto.files],
            },
        }

        response = await adapter.send_query_form_data(
            operations=json.dumps(operations),
            files=dto.files,
            headers=headers,
        )

        return response

    mutation = queries.update_message_without_files % dto.model_dump()
    response = await adapter.send_query_json(query=mutation, headers=headers)

    return response
