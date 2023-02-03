---
title: docker部署kafka集群
date: 2023-02-02 15:28:39
categories: 
- docker
- kafka
tags:
- docker
- kafka
---
## docker搭建Zookeeper单机+kafka集群
### 环境
Linux系统：centos 8
Zookeeper：wurstmeister/zookeeper
Kafka：wurstmeister/kafka

### Zookeeper单机
~~~
docker pull wurstmeister/zookeeper

docker run -d --name zookeeper -p 2181:2181 -t wurstmeister/zookeeper
~~~
### Kafka集群
~~~
docker pull wurstmeister/kafka

docker run -d --name kafka0 -p 9092:9092 \
-e KAFKA_BROKER_ID=0 \
-e KAFKA_ZOOKEEPER_CONNECT=124.221.83.80:2181 \
-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://124.221.83.80:9092 \
-e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 \
-t wurstmeister/kafka

docker run -d --name kafka1 -p 9093:9093 \
-e KAFKA_BROKER_ID=1 \
-e KAFKA_ZOOKEEPER_CONNECT=124.221.83.80:2181 \
-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://124.221.83.80:9093 \
-e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9093 \
-t wurstmeister/kafka

docker run -d --name kafka2 -p 9094:9094 \
-e KAFKA_BROKER_ID=2 \
-e KAFKA_ZOOKEEPER_CONNECT=124.221.83.80:2181 \
-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://124.221.83.80:9094 \
-e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9094 \
-t wurstmeister/kafka
~~~
~~~
docker ps

CONTAINER ID   IMAGE                    COMMAND                  CREATED          STATUS          PORTS                                                                   NAMES
3950fc28423e   wurstmeister/kafka       "start-kafka.sh"         6 seconds ago    Up 5 seconds    0.0.0.0:9094->9094/tcp, :::9094->9094/tcp                               kafka2
12cf92618c00   wurstmeister/kafka       "start-kafka.sh"         8 seconds ago    Up 7 seconds    0.0.0.0:9093->9093/tcp, :::9093->9093/tcp                               kafka1
a525a115890b   wurstmeister/kafka       "start-kafka.sh"         9 seconds ago    Up 7 seconds    0.0.0.0:9092->9092/tcp, :::9092->9092/tcp                               kafka0
ff862fe0f2ca   wurstmeister/zookeeper   "/bin/sh -c '/usr/sb…"   27 minutes ago   Up 27 minutes   22/tcp, 2888/tcp, 3888/tcp, 0.0.0.0:2181->2181/tcp, :::2181->2181/tcp   zookeeper
~~~
### 创建topic测试
~~~
docker exec -it kafka0 bash
cd opt/kafka_2.13-2.8.1/bin
kafka-topics.sh --zookeeper 124.221.83.80:2181 --create --topic topic-demo --partitions 3 --replication-factor 1
kafka-topics.sh --zookeeper 124.221.83.80:2181 --describe --topic topic-demo
~~~
