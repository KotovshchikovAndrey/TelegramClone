import httpx

from models.user import CurrentUser
from settings import settings


async def get_current_user(user_session: str):
    base_url = f"http://{settings.server_host}:{settings.server_port}"
    async with httpx.AsyncClient(base_url=base_url) as client:
        response = await client.get(
            url="/auth/authenticate",
            headers={"User-Session": user_session},
        )

        if response.status_code == 200:
            return CurrentUser(**response.json())
