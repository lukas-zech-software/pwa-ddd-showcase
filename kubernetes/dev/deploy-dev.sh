#!/usr/bin/env bash

COMMIT_ID=$1
ONLY="ALL"

gcloud config set project tablespotter
gcloud container clusters get-credentials cluster-my-old-startups-domain-de-1 --zone europe-west3-a --project tablespotter

if [ -z "$1" ]
then
	COMMIT_ID=$(git rev-parse HEAD)
else
	COMMIT_ID=$1
fi

if [ -z "$2" ]
then
  ONLY="ALL"
else
  ONLY=$2
fi

echo "Deploying #$COMMIT_ID to $ONLY"

## CUSTOMER APP
if [[ $ONLY = "ALL" ]] || [[ $ONLY = "CUSTOMER" ]]; then
  cat customer-dev-api.yml | \
  sed 's/\$COMMIT_ID'"/$COMMIT_ID/g" | \
  kubectl apply -f -

  cat customer-dev-frontend.yml | \
  sed 's/\$COMMIT_ID'"/$COMMIT_ID/g" | \
  kubectl apply -f -

   cat dashboard-dev-api.yml | \
  sed 's/\$COMMIT_ID'"/$COMMIT_ID/g" | \
  kubectl apply -f -

  cat dashboard-dev-frontend.yml | \
  sed 's/\$COMMIT_ID'"/$COMMIT_ID/g" | \
  kubectl apply -f -
fi
