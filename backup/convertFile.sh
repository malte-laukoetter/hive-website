#!/usr/bin/env bash

read string

gamemode=${string%%0c 0b 12 04 64*}
gamemode=$(echo ${gamemode:6} | xxd -r -p)

string="${string:36}"
gmlength=${#gamemode}
delLenght=$((gmlength * 3))
string="${string:delLenght}"

date="${string::36}"
date=$(echo $date | xxd -r -p)

fileNum=${date:(-1):1}
date=${date::-2}

string="${string:87:-15}"

if [[ ! -e "./convertedData" ]]; then
  mkdir "./convertedData"
fi
if [[ ! -e "./convertedData/$gamemode" ]]; then
  mkdir "./convertedData/$gamemode"
fi
if [[ ! -e "./convertedData/$gamemode/$date" ]]; then
  mkdir "./convertedData/$gamemode/$date"
fi

echo "$(date +"%T") Extracting $gamemode $date $fileNum: ${#string}"

echo $string | xxd -r -p | base64 -w0  | node ./lzstringDecodeFromBase64.js > "./convertedData/$gamemode/$date/$fileNum.json"
#               ^- hex -> ascii   ^- ascii -> base64     ^- base64 lzstring encoded json to json
