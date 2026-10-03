#!/usr/bin/env bash

gcloud config set project my-old-startup
kubectl config use-context gke_my-old-startup_europe-west3-b_cluster-europe-west3-b

gcloud beta firestore export gs://my-old-startup_firestore_backup
