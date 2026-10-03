#!/usr/bin/env bash

## Create service account to
PROJECT_ID=tablespotter

gcloud iam service-accounts create clouddns-service-account \
--display-name=clouddns-service-account \
--project=${PROJECT_ID}

gcloud iam service-accounts keys create ./clouddns.key.json \
--iam-account=clouddns-service-account@${PROJECT_ID}.iam.gserviceaccount.com \
--project=${PROJECT_ID}

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
--member=serviceAccount:clouddns-service-account@${PROJECT_ID}.iam.gserviceaccount.com \
--role=roles/dns.admin

kubectl create secret generic clouddns \
--from-file=./clouddns.key.json \
--namespace=cert-manager
