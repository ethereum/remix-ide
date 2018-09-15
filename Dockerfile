FROM ubuntu:xenial

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app:/usr/local/bin:$PATH
EXPOSE 8080

RUN cd /usr/src/app
RUN apt-get update
RUN apt-get install -y sudo
RUN apt-get install --yes git-core
RUN apt-get --yes install curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
RUN apt-get --yes install -y nodejs
RUN apt-get --yes install -y build-essential
COPY . /usr/src/app
RUN npm install

CMD ["npm","start"]
