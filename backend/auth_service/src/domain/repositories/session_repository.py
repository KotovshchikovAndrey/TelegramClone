import typing as tp
from abc import abstractmethod

from domain.models.session import SessionCreate, SessionInDB, SessionUpdate

SessionKey: tp.TypeAlias = int


class ISessionRepository(tp.Protocol):
    @abstractmethod
    async def get_session(self, session_key: str) -> tp.Optional[SessionInDB]:
        ...

    @abstractmethod
    async def get_all_sessions(
        self, session_keys: tp.List[str]
    ) -> tp.List[SessionInDB]:
        ...

    @abstractmethod
    async def get_all_session_keys_by_part(self, session_key_part: str) -> tp.List[str]:
        ...

    @abstractmethod
    async def create_session(
        self, session_key: str, session_create: SessionCreate
    ) -> SessionKey:
        ...

    @abstractmethod
    async def update_session(
        self, session_key: str, session_update: SessionUpdate
    ) -> SessionKey:
        ...

    @abstractmethod
    async def delete_session(self, session_key: str) -> SessionKey:
        ...
