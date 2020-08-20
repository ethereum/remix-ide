**The project code base has been moved to https://github.com/ethereum/remix-project**

Although the [documentation](https://remix-ide.readthedocs.io/en/latest/) is still located in this repository.

Remix is a browser-based compiler and IDE that enables users to build **Ethereum contracts with Solidity language** and to debug transactions.

To try it out, visit [https://remix.ethereum.org](https://remix.ethereum.org).

https://github.com/ethereum/remix-ide/releases also gives others ways to use Remix locally. Please check it out.

Remix consists of many modules and in this repository you will find the Remix IDE (aka. Browser-Solidity).

![Remix screenshot](https://github.com/ethereum/remix-ide/raw/master/remix_screenshot.png)

## Release:

The latest release is always deployed to https://remix.ethereum.org, the actual code base is located at https://github.com/ethereum/remix-project
It is also possible to run Remix as a desktop application https://github.com/ethereum/remix-desktop/releases (Osx, Linux, Windows).

## Docker:

Prerequisites: 
* Docker (https://docs.docker.com/desktop/)
* Docker-compose (https://docs.docker.com/compose/install/)

### Run with docker

If you want to run latest changes that are merged into master branch then run:

```
docker pull remixproject/remix-ide:latest
docker run -p 8080:80 remixproject/remix-ide:latest
```

If you want to run latest remix-live release run.
```
docker pull remixproject/remix-ide:remix_live
docker run -p 8080:80 remixproject/remix-ide:remix_live
```

### Run with docker-compose:

To run locally without building you only need docker-compose.yaml file and you can run:

```
docker-compose pull
docker-compose up -d
```

Then go to http://localhost:8080 and you can use you Remix instance.

To fetch docker-compose file without cloning this repo run:
```
curl https://raw.githubusercontent.com/ethereum/remix-ide/master/docker-compose.yaml > docker-compose.yaml
```

## Documentation

To see details about how to use Remix for developing and/or debugging Solidity contracts, please see [our documentation page](https://remix-ide.readthedocs.io/en/latest/)
