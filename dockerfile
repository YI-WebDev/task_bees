ARG APP_PATH=/var/www/src 

FROM node:22.13.1-alpine

ARG APP_PATH

RUN mkdir -p ${APP_PATH}
WORKDIR ${APP_PATH}

COPY ./package.json ./package-lock.json ./

RUN apk update --no-cache && \
  apk upgrade --no-cache && \
  apk add --no-cache vim yarn bash

RUN npm install

COPY ./public/ ${APP_PATH}/public/
COPY ./src/ ${APP_PATH}/src/

COPY ./.env* \
  ./index.html \
  ./vite.config.ts \
  ./package.json \
  ./tsconfig.json \
  ./tsconfig.app.json \
  ./tsconfig.node.json \
  ./postcss.config.js \
  ./tailwind.config.js \
  ./eslint.config.js \
  ${APP_PATH}/

EXPOSE 5173

CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0" ]



