#!/usr/bin/env bash

./install-cert-manager.sh
	echo "Installed cert-manager"

./create-dns-service.sh
	echo "Created DNS service account for cert manager"

kubectl apply --filename=./certificate-issuer.yml
	echo "Created certificate issuer"

kubectl apply --filename=./certificate.yml
	echo "Created certificate"

	printf "Install Ingress load balancer AFTER certificate was issued:\n  \$ kubectl apply --filename=./ingress.yml"

## TODO: get credentials via gcloud
kubectl create secret generic api-service-iam-json --from-file="$HOME/Projects/my-old-startup/json_keys/my-old-startup-a890aaefe5d7.json" --namespace=cert-manager

	echo "Deploying application"

if [ -z "$1" ]
then
	echo "Commit mut be provided"
	exit 1;
else
	COMMIT_ID=$1
fi

./deploy ${COMMIT_ID}
	echo "Application deployed for ${COMMIT_ID}"
