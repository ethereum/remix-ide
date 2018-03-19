FROM node as build-env

RUN mkdir /work

ADD ./ /work/

WORKDIR /work

RUN npm install && npm run downloadsolc_root && npm run build

RUN tar -cvf dist_files.tar assets background.js build icon.png index.html manifest.json README.md soljson.js

FROM node:alpine

RUN mkdir /app

COPY --from=build-env /work/dist_files.tar /app/

WORKDIR /app

RUN tar -xf dist_files.tar

EXPOSE 8080

CMD [ "npx", "http-server", "/app" ]
