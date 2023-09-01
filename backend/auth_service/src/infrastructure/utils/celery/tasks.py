import asyncio

from . import celery, mail_service


@celery.task(name="send_login_code_email", bind=True, max_retries=3)
def send_login_code_email(self, email: str, code: int):
    try:
        asyncio.run(mail_service.send_login_code(email, code))
    except Exception as exc:
        raise self.retry(exc=exc, countdown=2)
