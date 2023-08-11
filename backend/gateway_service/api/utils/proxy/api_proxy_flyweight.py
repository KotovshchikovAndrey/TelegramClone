import typing as tp

from api.utils.proxy.api_proxy import ApiProxy, IApiProxy
from settings import settings


class ApiProxyFlyweight:
    _proxis: tp.Dict[str, IApiProxy] = {}

    def __init__(self) -> None:
        self._proxis["messages"] = ApiProxy(base_url=settings.conservation_service_host)
        self._proxis["auth"] = ApiProxy(base_url=settings.auth_service_host)

    def get_api_proxy(self, name: str) -> IApiProxy:
        api_proxy = self._proxis[name]
        return api_proxy
