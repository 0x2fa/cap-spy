#!/usr/bin/env bash

source .env.prod && docker run -d \
    --name spydb \
    --restart unless-stopped \
    -p 5432 \
    -v $PGDATA_DIR:/var/lib/postgresql/data/pgdata \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
    -e POSTGRES_USER=$POSTGRES_USER \
    -e POSTGRES_DB=$POSTGRES_DB \
    postgres:13

