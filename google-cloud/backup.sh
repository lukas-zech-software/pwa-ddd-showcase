#!/usr/bin/env bash

gcloud config set project tablespotter
kubectl config use-context gke_tablespotter_europe-west3-b_cluster-europe-west3-b

gcloud beta firestore export gs://my-old-startup_firestore_backup
