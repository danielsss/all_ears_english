#!/bin/sh

npm run build

if [[ $? != 0 ]]; then
  echo "build error."
  exit 1;
fi

exit 0;
