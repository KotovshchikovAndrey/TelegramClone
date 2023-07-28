import httpx


async def get_location_by_ip(ip: str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://ipapi.co/{ip}/json/")
        response_data = dict(response.json())
        location = response_data["city"] + "," + response_data["country_name"]

    return location
