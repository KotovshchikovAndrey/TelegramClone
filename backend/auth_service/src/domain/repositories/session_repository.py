import typing as tp
from abc import abstractmethod

from domain.models.session import (
    SessionCreate,
    SessionInDB,
    SessionData,
    SessionPayload,
)

SessionKey: tp.TypeAlias = int


class ISessionRepository(tp.Protocol):
    @abstractmethod
    async def create_session(
        self, session_key: str, session_create: SessionCreate
    ) -> SessionKey:
        ...

    @abstractmethod
    async def get_session(self, session_key: str) -> tp.Optional[SessionInDB]:
        ...

    @abstractmethod
    async def update_session(
        self, session_key: str, new_session_data: SessionData
    ) -> SessionKey:
        ...

    @abstractmethod
    async def delete_session(self, session_key: str) -> None:
        ...
