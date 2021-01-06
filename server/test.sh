#!/bin/sh
set -e

db=/tmp/test.db

rm $db 2>/dev/null ||:

./db_test.py

for x in users challenges solves
do
    echo -e "\n--> ${x}: \n"
    sqlite3 -header -column $db "select * from ${x}"
done
