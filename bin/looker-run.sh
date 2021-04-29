#!/usr/bin/env bash

docker network create spy

docker run -d \
    --name some-postgres \
    -p 5432 \
    -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
    -e POSTGRES_USER=$POSTGRES_USER \
    -e POSTGRES_DB=$POSTGRES_DB \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -v $PGDATA_DIR:/var/lib/postgresql/data \
    --network=spy \
    postgres

docker run -d \
  --name cryptosaint-net \
  -p 9669 \
  --restart unless-stopped \
  -v $PWD:/usr/src/app \
  -v /vol/log/cryptosaint_net:/var/log/cryptosaint_net \
  -e NODE_ENV=production \
  -e VIRTUAL_HOST=cryptosaint.net,www.cryptosaint.net,com \
  -e LETSENCRYPT_HOST=cryptosaint.net,www.cryptosaint.net \
  -e LETSENCRYPT_EMAIL=cryptosaint@sameteam.co \
  --network=spy \
  -w /usr/src/app node:erbium-alpine3.10 npm run start
