FROM node:22.9.0-alpine3.19


RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app


COPY --chown=node:node package*.json ./

USER node

RUN npm install


RUN npm ci


COPY --chown=node:node ./dist ./dist
COPY --chown=node:node ./adapters ./adapters
COPY --chown=node:node ./node_modules ./node_modules
COPY --chown=node:node ./server ./server


EXPOSE 3000

CMD [ "node", "server/entry.express" ]