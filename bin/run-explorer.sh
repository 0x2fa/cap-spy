#!/usr/bin/env bash

docker run -d \
    --name explorer \
    --restart unless-stopped \
    -p 8501 \
    -e PG_CONF=$PG_CONF \
    -e VIRTUAL_HOST=$VIRTUAL_HOST \
    -e LETSENCRYPT_HOST=$LETSENCRYPT_HOST \
    -e LETSENCRYPT_EMAIL=$LETSENCRYPT_EMAIL \
    crypto-explorer:latest

