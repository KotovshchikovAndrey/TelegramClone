from pydantic import BaseModel
from domain.models.user import UserPayload
from domain.models.session import SessionPayload


class ConfirmLoginResponse(BaseModel):
    user: UserPayload
    session_payload: SessionPayload
