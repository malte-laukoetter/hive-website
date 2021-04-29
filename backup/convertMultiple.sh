for i in $(eval echo "{$1..$2}"); do
    sh extract_data.sh ".\all_kinds\output-$i"
done
