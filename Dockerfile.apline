FROM node:10-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app:/usr/local/bin:$PATH
EXPOSE 8080
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh python alpine-sdk

RUN cd /usr/src/app
COPY . /usr/src/app
RUN rm -Rf node_modules/
RUN npm install
CMD ["npm","start"]
