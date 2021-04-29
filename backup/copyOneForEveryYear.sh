#!/usr/bin/env bash

cd convertedData

if [[ ! -e "../copied" ]]; then
  mkdir "../copied"
fi

for file in ./*/2021-04-15/*.json; do
  folder=${file#*/} 
  gm=${folder%%/*}
  date=${folder%/*}
  folder="../copied/${folder%/*}"

  if [[ ! -e "../copied/$gm" ]]; then
    mkdir "../copied/$gm"
  fi
  if [[ ! -e "../copied/$date" ]]; then
    mkdir "../copied/$date"
  fi

  cp $file "../copied/$date"
done