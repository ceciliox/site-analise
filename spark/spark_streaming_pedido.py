from pyspark import SparkContext
from pyspark.streaming import StreamingContext
from pyspark.streaming.kafka import KafkaUtils
from pykafka import KafkaClient
import json
import sys
import pprint

def buscaStatusPedido(contador_status1):
    client = KafkaClient(hosts="cxln3.c.thelab-240901.internal:6667")
    topic = client.topics['order-data-armazena']
    for contador_status in contador_status1:
	    with topic.get_producer() as producer:
		    producer.produce(json.dumps(contador_status))

zkQuorum, topic = sys.argv[1:]
sc = SparkContext(appName="contadorPedidosKafka")
ssc = StreamingContext(sc, 60)
kvs = KafkaUtils.createStream(ssc, zkQuorum, "spark-streaming-consumer", {topic: 1})
lines = kvs.map(lambda x: x[1])
contador_status = lines.map(lambda line: line.split(",")[2]) \
              .map(lambda status-pedido: (status-pedido, 1)) \
              .reduceByKey(lambda a, b: a+b)
contador_status.pprint()
contador_status.foreachRDD(lambda rdd: rdd.foreachPartition(buscaStatusPedido))
ssc.start()
ssc.awaitTermination()
