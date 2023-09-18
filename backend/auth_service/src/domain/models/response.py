import typing as tp
from pydantic import BaseModel, validator

from domain.models.session import SessionPayload, SessionInDB
from domain.models.user import UserPayload


class ConfirmLoginResponse(BaseModel):
    user: UserPayload
    session_payload: SessionPayload


class ActiveSessionsResponse(BaseModel):
    user: UserPayload
    active_sessions: tp.List[SessionPayload]

    @validator("active_sessions", pre=True)
    def serialize_active_sessions(cls, sessions: tp.List[SessionInDB]):
        active_sessions_payload = []
        for session in sessions:
            active_session_payload = SessionPayload(
                user_device=session.data.user_device,
                user_ip=session.data.user_ip,
                user_location=session.data.user_location,
            )

            active_sessions_payload.append(active_session_payload)

        return active_sessions_payload
