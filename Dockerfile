FROM node:16-alpine

COPY package.json package-lock.json /service/
WORKDIR /service
RUN npm ci

COPY src /service/src
COPY tsconfig.json /service/
COPY firebaseServiceAccount.json /service/
COPY .env /service/

RUN npm run build

ENTRYPOINT [ "node", "./dist/index.js" ]
