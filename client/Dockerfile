###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:16.18.0-alpine As development

USER node

EXPOSE ${CLIENT_PORT}

###################
# BUILD FOR PRODUCTION
###################

FROM node:16.18.0-alpine AS builder
ENV NODE_ENV production

WORKDIR /usr/src/app/client

COPY --chown=node:node client ./
COPY --chown=node:node models ../models

RUN npm ci
RUN npm run build

# Bundle static assets with nginx
FROM nginx:1.23.1-alpine as production
ENV NODE_ENV production

EXPOSE ${CLIENT_PORT}

COPY --from=builder /usr/src/app/client/build /usr/share/nginx/html

COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
