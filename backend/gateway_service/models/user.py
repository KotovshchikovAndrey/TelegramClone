import typing as tp
from pydantic import UUID4, BaseModel


class CurrentUser(BaseModel):
    user_uuid: UUID4
    name: str
    surname: str
    phone: str
    email: str
