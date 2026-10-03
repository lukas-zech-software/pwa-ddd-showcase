FROM mhart/alpine-node:13 AS builder

# Instal python to build bcrypt
RUN apk update
RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm config set python /usr/bin/python

# Copy app source
COPY common /opt/my-old-startups-domain/common
COPY api /opt/my-old-startups-domain/api

# silence console ads for clean build logs
ENV CI=1
ENV DISABLE_OPENCOLLECTIVE=1

WORKDIR /opt/my-old-startups-domain/common
RUN npm install

WORKDIR /opt/my-old-startups-domain/api
RUN npm install
RUN npm rebuild grpc

# Building
RUN npm run build

## SECOND STEP

FROM mhart/alpine-node:13 AS runner

COPY --from=builder /opt/my-old-startups-domain/common /opt/my-old-startups-domain/common
COPY --from=builder /opt/my-old-startups-domain/api/build /opt/my-old-startups-domain/api/build
COPY --from=builder /opt/my-old-startups-domain/api/node_modules /opt/my-old-startups-domain/api/node_modules

WORKDIR /opt/my-old-startups-domain/api

# Environment variables
ARG is_staging
ENV IS_STAGING=${is_staging}
ARG base_domain
ENV BASE_DOMAIN=${base_domain}

ENV UV_THREADPOOL_SIZE=32
ENV TZ='Europe/Berlin'
ENV API_TYPE=PUBLIC
ENV NODE_ENV=production
ENV API_PORT=8181

EXPOSE 8181

# Start Server
ENTRYPOINT ["node", "build/api/src/index.js"]
