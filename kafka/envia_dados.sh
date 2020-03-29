#!/bin/bash

: '
export PATH=$PATH:/usr/hdp/current/kafka-broker/bin
ARQUIVOS=$1/*.csv
for f in $ARQUIVOS
do
    echo "buscando $f arquivos"
    cat $f | kafka-console-producer.sh --broker-list $2  --topic $3
    sleep 60
done
'

export PATH=$PATH:/usr/hdp/current/kafka-broker/bin
ARQUIVOS=$1/out.csv
while :
do
    echo "buscando $ARQUIVOS arquivos"
    cat $ARQUIVOS
    cat $ARQUIVOS | kafka-console-producer.sh --broker-list $2  --topic $3
    sleep 60
done