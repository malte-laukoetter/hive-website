# for i in ./hive/**/*.json; do
#   RESOURCE_NAME="${i#./hive/}"

#   echo "https://api.hivemc.com/v1/${RESOURCE_NAME%.json}"
#   curl "https://api.hivemc.com/v1/${RESOURCE_NAME%.json}" -o $i
# done

# for i in ./hive/**/**/*.json; do
#   RESOURCE_NAME="${i#./hive/}"

#   echo "https://api.hivemc.com/v1/${RESOURCE_NAME%.json}"
#   curl "https://api.hivemc.com/v1/${RESOURCE_NAME%.json}" -o $i
# done


# for i in ./hive/**/**/**/*.json; do
#   RESOURCE_NAME="${i#./hive/}"

#   echo "https://api.hivemc.com/v1/${RESOURCE_NAME%.json}"
#   curl "https://api.hivemc.com/v1/${RESOURCE_NAME%.json}" -o $i
# done