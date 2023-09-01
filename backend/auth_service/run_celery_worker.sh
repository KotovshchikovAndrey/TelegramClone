#!/bin/bash

source ./venv/Scripts/activate

while read line; do export $line; done < .env

cd ./src

celery -A infrastructure.utils.celery.tasks:celery worker --loglevel=INFO --pool=solo