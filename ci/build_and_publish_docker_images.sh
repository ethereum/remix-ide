#!/bin/bash
set -e

# If not staging and master branch are existing
export TAG="$CIRCLE_BRANCH"

echo $TAG

cd environments && cp .env.$TAG .env
echo $SERVICE

docker login --username $DOCKER_USER --password $DOCKER_PASS
docker-compose -f $SERVICE.yaml -f build-$SERVICE.yaml build
docker push ethereum/source-verify:$SERVICE-$TAG
