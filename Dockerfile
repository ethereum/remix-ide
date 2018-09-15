FROM node:10-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app:/usr/local/bin:$PATH
EXPOSE 8080

RUN cd /usr/src/app
COPY . /usr/src/app

CMD ["npm","start"]
