FROM eu.gcr.io/tablespotter/frontend-dependencies:latest AS builder

# Environment variables
ARG base_domain
ENV BASE_DOMAIN=${base_domain}
ARG node_env
ENV NODE_ENV=${node_env}
ARG is_staging
ENV IS_STAGING=${is_staging}

# Copy app source
COPY common /opt/my-old-startups-domain/common/
COPY frontend/common /opt/my-old-startups-domain/frontend/common/
COPY frontend/hub /opt/my-old-startups-domain/frontend/hub/

# Building
WORKDIR /opt/my-old-startups-domain/frontend/hub
RUN echo "Starting build"
RUN npm run build
RUN echo "Finished build"

## SECOND STEP

## Serve files from NGINX
FROM nginx:1.15.3-alpine AS runner

# Copy static content
COPY --from=builder /opt/my-old-startups-domain/frontend/hub/build /opt/my-old-startups-domain/frontend/hub/build

# overwrite default.conf from nginx image
COPY --from=builder /opt/my-old-startups-domain/frontend/hub/server/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
