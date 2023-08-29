import json
import typing as tp

from api.graphql import queries
from api.utils.adapters.graphql_adapter import GraphqlAdapter
from models.message import MessageUpdate, PersonalMessageCreate, UserMessageStatusUpdate
from models.user import CurrentUser
from settings import settings


async def get_all_conversations_for_current_user(
    current_user: CurrentUser,
    limit: int = 10,
    offset: int = 0,
):
    adapter = GraphqlAdapter(graphql_api_url=settings.conservation_service_host)
    headers = {
        "Apollo-Require-Preflight": "true",
        "Authorizer": current_user.model_dump_json(),
    }

    query = queries.GET_ALL_CONVERSATIONS_FOR_CURRENT_USER % {
        "limit": limit,
        "offset": offset,
    }

    response = await adapter.send_query_json(query=query, headers=headers)
    return response


async def create_personal_message(
    current_user: CurrentUser,
    dto: PersonalMessageCreate,
):
    adapter = GraphqlAdapter(graphql_api_url=settings.conservation_service_host)
    headers = {
        "Apollo-Require-Preflight": "true",
        "Authorizer": current_user.model_dump_json(),
    }

    if dto.files:
        operations = {
            "query": queries.CREATE_MESSAGE_WITH_FILES,
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

    mutation = queries.CREATE_MESSAGE_WITHOUT_FILES % dto.model_dump()
    response = await adapter.send_query_json(query=mutation, headers=headers)

    return response


async def update_message(current_user: CurrentUser, dto: MessageUpdate):
    adapter = GraphqlAdapter(graphql_api_url=settings.conservation_service_host)
    headers = {
        "Apollo-Require-Preflight": "true",
        "Authorizer": current_user.model_dump_json(),
    }

    if dto.files:
        operations = {
            "query": queries.UPDATE_MESSAGE_WITH_FILES,
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

    mutation = queries.UPDATE_MESSAGE_WITHOUT_FILES % dto.model_dump()
    response = await adapter.send_query_json(query=mutation, headers=headers)

    return response


async def set_message_status_for_current_user(
    current_user: CurrentUser,
    dto: UserMessageStatusUpdate,
):
    adapter = GraphqlAdapter(graphql_api_url=settings.conservation_service_host)
    headers = {
        "Apollo-Require-Preflight": "true",
        "Authorizer": current_user.model_dump_json(),
    }

    mutation = queries.SET_MESSAGE_STATUS_FOR_CURRENT_USER % dto.model_dump()
    response = await adapter.send_query_json(query=mutation, headers=headers)

    return response
