ARG NODE_VERSION=8.9-alpine
FROM node:${NODE_VERSION}

ENV node_env=development
ENV PLATFORM=DESKTOP

RUN apk upgrade --update && apk add --update git

WORKDIR /app

COPY package.json package-lock.json  ./

RUN npm install

COPY . .

EXPOSE 8082
CMD [ "npm", "run", "dev" ]
