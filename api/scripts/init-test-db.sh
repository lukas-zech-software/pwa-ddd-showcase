#!/usr/bin/env bash

$(gcloud beta emulators datastore env-init)
$(scripts/set-env-hub-dev.sh)
npm run build && node ./build/api/test/data/db/init-test-db.js
