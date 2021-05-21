#!/usr/bin/env bash

source .env.prod && docker run -d \
    --name explorer \
    --restart unless-stopped \
    -p 8501 \
    --link spydb:postgres \
    -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
    -e VIRTUAL_HOST=$VIRTUAL_HOST \
    -e LETSENCRYPT_HOST=$LETSENCRYPT_HOST \
    -e LETSENCRYPT_EMAIL=$LETSENCRYPT_EMAIL \
    -w /usr/src/app \
    crypto-explorer:latest streamlit run app.py

