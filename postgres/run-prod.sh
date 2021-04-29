#!/usr/bin/env bash

source .env.prod && docker run -d \
    --restart unless-stopped \
    --name spy-postgres \
    -p 5432:5432 \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -v $PGDATA_DIR:/var/lib/postgresql/data/pgdata \
    --network=spy \
    spydb
