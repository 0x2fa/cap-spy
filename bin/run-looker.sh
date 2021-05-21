#!/usr/bin/env bash

docker run -d \
    --name looker \
    --restart unless-stopped \
    -v $PWD:/usr/src/app \
    -v $JSONDB_DIR:/usr/src/db \
    -e JSONDB_DIR=/usr/src/db \
    -e LIMIT=$LIMIT \
    -e LOOPTIME=$LOOPTIME \
    -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
    -e POSTGRES_USER=$POSTGRES_USER \
    -e POSTGRES_DB=$POSTGRES_DB \
    -e NODE_ENV=$NODE_ENV \
    -e COINMARKETCAP_KEY=$COINMARKETCAP_KEY \
    -e LOOKER_PASSWORD=$LOOKER_PASSWORD \
    -w /usr/src/app \
    node:erbium-alpine3.10 npm run looker
