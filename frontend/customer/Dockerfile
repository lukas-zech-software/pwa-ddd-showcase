FROM eu.gcr.io/tablespotter/frontend-dependencies:latest AS builder

# Building
ARG base_domain
ENV BASE_DOMAIN=${base_domain}
ARG is_staging
ENV IS_STAGING=${is_staging}

# Copy app source
COPY common /opt/my-old-startups-domain/common/
COPY frontend/common /opt/my-old-startups-domain/frontend/common/
COPY frontend/customer /opt/my-old-startups-domain/frontend/customer/

WORKDIR /opt/my-old-startups-domain/frontend/customer

RUN echo "Starting build"
RUN npm run build
RUN echo "Finished build"

## SECOND STEP

FROM node:12.2-alpine AS runner

ARG base_domain
ENV BASE_DOMAIN=${base_domain}
ARG is_staging
ENV IS_STAGING=${is_staging}
RUN echo "Copy from BUILDER"

COPY --from=builder /opt/my-old-startups-domain/common/ /opt/my-old-startups-domain/common/
COPY --from=builder /opt/my-old-startups-domain/frontend/common /opt/my-old-startups-domain/frontend/common
COPY --from=builder /opt/my-old-startups-domain/frontend/node_modules /opt/my-old-startups-domain/frontend/node_modules
COPY --from=builder /opt/my-old-startups-domain/frontend/customer /opt/my-old-startups-domain/frontend/customer

WORKDIR /opt/my-old-startups-domain/frontend/customer

ENV NODE_ENV='production'
ENV COMMIT_ID=$COMMIT_ID
ENV PORT=8080
ENV HOST='0.0.0.0'

EXPOSE 8080

RUN echo "Starting server"

# Start the server
ENTRYPOINT ["npm","start"]

