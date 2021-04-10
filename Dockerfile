FROM node:current-alpine3.13

RUN set -x && \
    apk add --no-cache --update g++ gcc libgcc libstdc++ linux-headers make && \
    apk add vips-dev fftw-dev build-base python3 --update --no-cache \
    --repository https://alpine.global.ssl.fastly.net/alpine/edge/testing/ \
    --repository https://alpine.global.ssl.fastly.net/alpine/edge/main


WORKDIR /usr/src/app

COPY package.json ./

COPY . .

RUN set -x && \
    npm config set ignore-scripts false && \
    npm install && \
    npm install --ignore-scripts=false --verbose --arch=x64 --platform=linux sharp


EXPOSE 8080

CMD ["npm", "run", "dev"]
