# This dockerfile is to build each branch seperately (for dev purpouses)
FROM node:10
# Create Remix user, don't use root!
# #Now do remix stuff
# USER remix


COPY . ./home/remix
WORKDIR /home/remix

RUN npm install  --registry=https://registry.npm.taobao.org
RUN npm run build

FROM nginx:latest AS PROD
WORKDIR /usr/share/nginx/html

COPY --from=0 /home/remix/build/ /usr/share/nginx/html/build/
COPY --from=0 /home/remix/index.html /usr/share/nginx/html/index.html
COPY --from=0 /home/remix/nginx.conf /etc/nginx/nginx.conf
COPY --from=0 /home/remix/assets/ /usr/share/nginx/html/assets/
COPY --from=0 /home/remix/icon.png /usr/share/nginx/html/icon.png
COPY --from=0 /home/remix/background.js /usr/share/nginx/html/background.js
COPY --from=0 /home/remix/soljson.js /usr/share/nginx/html/soljson.js
COPY --from=0 /home/remix/package.json /usr/share/nginx/html/package.json

EXPOSE 80 65520
