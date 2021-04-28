#!/usr/bin/env bash

docker-compose build looker
docker-compose up --no-deps -d looker
