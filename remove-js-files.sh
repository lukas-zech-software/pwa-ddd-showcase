#!/usr/bin/env bash

for f in $(find **/* -name '*.js' -not -path "*node_modules*" -not -path "*build*" -not -path "*.next*"); do
  [ -e "${f%.*}.ts" ] && echo rm -- "$f"
done

## Running the script will only show the files to be deleted in a dry run
## To delete the files run $(./remove-js-files)
