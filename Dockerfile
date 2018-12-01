FROM node:8-alpine as build-env

RUN mkdir /src

WORKDIR /src

ADD ./ /src

RUN apk add --no-cache build-base git python

RUN npm i && npm run prepublish

RUN tar -cvf dist.tar index.html icon.png soljson.js assets build

FROM nginx:alpine

COPY --from=build-env /src/dist.tar /src/

RUN tar -xvf /src/dist.tar -C /usr/share/nginx/html/ && rm /src/dist.tar
