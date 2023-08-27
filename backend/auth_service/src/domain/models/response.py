from pydantic import BaseModel

from domain.models.session import SessionPayload
from domain.models.user import UserPayload


class ConfirmLoginResponse(BaseModel):
    user: UserPayload
    session_payload: SessionPayload
