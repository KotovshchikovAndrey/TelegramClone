from databases import Database


def get_postgres_connection(
    host: str,
    port: str | int,
    user: str,
    password: str,
    db_name: str,
) -> Database:
    url = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db_name}"
    database = Database(url)

    return database
