#!/usr/bin/env bash

docker-compose build spy-postgres
docker-compose up --no-deps -d spy-postgres
