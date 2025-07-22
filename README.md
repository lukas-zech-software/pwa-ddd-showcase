# Personal Code Showcase

> **Please note:**
>
> This is a showcase repository which contains some of the source code of my old startup
> 
> I wrote all of this code myself in 2020
> 
> The code is only meant to demonstrate some architectural decisions, Domain-Driven Design principles and general impressions of code quality
>
> * There is no live version of this application running anymore as the company was shutdown in 2024
> * This repository will most likely not build, as it was not maintained for quite some time
> * All Domains, Cloud Projects, DBs or other storages have long been deleted.
> * All confidential data should have been removed or replaced, but if there is still anything like a credential left there is no security concern that could be to be impacted

> I am the owner of the code and hold all copyrights
> It is provided under the "Unlicense" for everyone read, copy or use it however you want
<br>
<br>

Below this line is the original README of the old repository
<hr>


<br>
<br>

# Development

Minikube needs access to the Google  Cloud container Registry
https://ryaneschinger.com/blog/using-google-container-registry-gcr-with-minikube/

# Building

There a 3 different build configurations:

## Default
Will only build the applications with the latest image of the dependencies.
*Will be triggered by push on master on any feature branch*

## Dependencies
Will only build the dependencies for frontend and api.
To updated dependencies, create a branch that starts with *dependencies/* and create a review for it

## Release
Will build the dependencies and application. This will be used for every mayor release to ensure update to date deps.
Create a branch that starts with *release/* and create a review for it

# Deployment
Deployment is done via kubectl. The configuration files are in ./kubernetes.
There is a `deploy.sh` script which makes it easier to deploy the whole application.
Usage is:

`$ deploy $COMMIT_ID` + optionally the system to deploy `APP|DASHBORD|HUB`

example:

`$ deploy 08f0e72d42fb9d8394535c507709a88b9abaddfc APP`

or simply to deploy *latest* for ALL

`$ deploy`

Before deploying check if the build for this commit went green
[https://console.cloud.google.com/cloud-build/builds?organizationId=19254438172&orgonly=true&project=tablespotter&supportedpurview=project]

Then check the kubernetes workloads if all pods went green with the new image
[https://console.cloud.google.com/kubernetes/workload?organizationId=19254438172&orgonly=true&project=tablespotter&supportedpurview=project&workload_list_tablesize=50]

*NOTE: You need to setup your gcloud utils to use the correct cluster*
`gcloud container clusters get-credentials cluster-my-old-startups-domain-de-1 --zone europe-west3-a --project tablespotter`

# Analytics

## Google Analytics Events

We use Events to track user interactions which aren't automatically tracked with Google Tag Manager. A full list of metrics we track can be found in [this doc](https://docs.google.com/spreadsheets/d/1ePZAikUFUnahI1QBhWKy0e25on6xRo-qbEAKUBfJdiw/edit#gid=0). Events are typed in the Dashboard and Customer apps and sent via the GoogleAnalyticsService. For more info on Events, see Google's documentation [here](https://support.google.com/analytics/answer/1033068).
