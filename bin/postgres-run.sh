#!/usr/bin/env bash

docker run -d \
    --restart always \
    --name spy-postgres \
    -p 5432:5432 \
#    -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
#    -e POSTGRES_USER=$POSTGRES_USER \
#    -e POSTGRES_DB=$POSTGRES_DB \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -v $PGDATA_DIR:/var/lib/postgresql/data/pgdata \
    --network=spy \
    spydb
