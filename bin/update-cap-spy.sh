#!/usr/bin/env bash

docker-compose build cap-spy
docker-compose up --no-deps -d cap-spy
