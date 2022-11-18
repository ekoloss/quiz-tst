###################
# DEVELOPMENT
###################

FROM node:16.18.0-alpine As development

USER node

EXPOSE ${SERVER_PORT}

###################
# BUILD FOR PRODUCTION
###################

FROM node:16.18.0-alpine As build

WORKDIR /usr/src/app/server

COPY --chown=node:node server ./
COPY --chown=node:node models ../models

RUN npm ci
RUN npm run build

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN rm -rf /usr/src/app/server/node_modules
RUN npm ci --omit=dev

RUN npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:16.18.0-alpine As production

EXPOSE ${SERVER_PORT}

COPY --chown=node:node --from=build /usr/src/app/server/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/server/dist ./dist

CMD [ "node", "dist/main.js" ]
