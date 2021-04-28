#!/usr/bin/env bash

function isUp {

  PS=$(docker inspect --format="{{ .Name }}" $(docker ps -q --no-trunc) | sed "s,/,,g")

  IS=not-running

  for c in $PS
  do
    if [[ "$c" == "$1" ]]; then
      IS=running
    fi
  done

  if [[ $IS == "not-running" ]]; then

    PSA=$(docker inspect --format="{{ .Name }}" $(docker ps -aq --no-trunc) | sed "s,/,,g")
    for c in $PSA
    do
      if [[ "$c" == "$1" ]]; then
        IS=stopped
      fi
    done
  fi

  echo $IS
}

images=(
"tron-redis"
"tron-postgres"
)

for image in "${images[@]}"
do
  echo $(isUp $image)
  if [[ $(isUp $image) != "not-running" ]]; then
    docker rm -f $image
  fi
done

if [[ "$1" == "" ]]; then
  nohup bin/migrate-all.sh >/tmp/migrations.log 2>&1 &
fi

cd bin
docker-compose up


