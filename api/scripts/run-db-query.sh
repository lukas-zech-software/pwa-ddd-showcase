#!/usr/bin/env bash

npm run build && node ./build/api/test/data/db/run-query.js

