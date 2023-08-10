from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    server_host: str
    server_port: int

    auth_service_host: str
    conservation_service_host: str

    kafka_host: str
    kafka_port: int
    kafka_consumer_topic: str
    kafka_producer_topic: str
    kafka_group_id: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
