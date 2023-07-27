from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    server_host: str
    server_port: int

    postgres_host: str
    postgres_port: str | int
    postgres_user: str
    postgres_password: str
    postgres_db_name: str

    redis_host: str
    redis_port: str | int
    redis_password: str
    redis_data_path: str

    mail_username: str
    mail_password: str
    mail_from: str
    mail_port: int
    mail_server: str
    mail_from_name: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
