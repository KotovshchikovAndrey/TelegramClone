import httpx

from api.exceptions.api_exception import ApiException
from models.user import CurrentUser
from settings import settings


async def get_current_user(user_session: str):
    base_url = settings.auth_service_host
    async with httpx.AsyncClient(base_url=base_url) as client:
        try:
            response = await client.get(
                url="/authenticate",
                headers={"User-Session": user_session},
            )

            if response.status_code == 200:
                return CurrentUser(**response.json())

        except (httpx.TimeoutException, httpx.ConnectError):
            raise ApiException.service_unavailable(message="Service Unavailable!")
