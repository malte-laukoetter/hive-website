#!/usr/bin/env bash

cd copied

for file in ./*/*/; do
  echo $file
  folder=${file#*/} 
  gm=${folder%%/*}
  date=${folder%/*}
  date=${date#*/}
  year=${date%%-*}

  mv $file "./$gm/$year"
done
