#!/usr/bin/env bash

# done: 0, 22

echo "$(date +"%T") Starting $1"

hextext=$(sh ./convert_to_hex.sh < $1)

# sh ./convert_to_hex.sh < ./all_kinds/output-22 > text.txt

echo "$(date +"%T") Converted to hex"

hextext=${hextext% [0-9][0-9][0-9]*}

# All 65536 (2^16) hex chars a seperator of 18 hex chars is inserted, this seperator fills the first bytes of the next 2^16 block

echo "$(date +"%T") Text length: ${#hextext}"

paddingRemovedHextext=${hextext:0:98304}

for ((i = 98325 ; i < ${#hextext} ; i+=98304)); do
  paddingRemovedHextext=$paddingRemovedHextext${hextext:i:98283}
done

echo "$(date +"%T") Padding removed"

echo "$(date +"%T") Text length (without sepeartors): ${#paddingRemovedHextext}"

echo $paddingRemovedHextext | awk '0 == NR%2 {
  cmd = "sh ./convertFile.sh"
  print | cmd
  close(cmd)
}' RS='10 67 61 6d 65 4c 65 61 64 65 72 62 6f 61 72 64 73 '

echo "$1" >> ./finished_files.txt

echo "$(date +"%T") Done"
