#!/usr/bin/env bash

(od -t x1 -v -w32 <&0) | while read line; do
  echo -n "${line#* } "
done
