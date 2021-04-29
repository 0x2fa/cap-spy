#!/usr/bin/env bash


docker rm -f spy-postgres-dev

docker run -it \
    --restart unless-stopped \
    --network=spy \
    --name spy-postgres-dev \
    --network-alias postgres.spy \
    -p 5432:5432 \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -v $PGDATA_DIR:/var/lib/postgresql/data/pgdata \
    spydb
