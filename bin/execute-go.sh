#! /bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
project=$1

if [ "$#" -lt 2 ]; then
  exit 1
fi

cd $DIR/../$1
go ${*:2}
