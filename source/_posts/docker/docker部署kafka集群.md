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
## 搭建环境
Linux系统：centos 8
Zookeeper：wurstmeister/zookeeper
Kafka：wurstmeister/kafka

## Zookeeper
~~~
docker pull wurstmeister/zookeeper

docker run -d --name zookeeper -p 2181:2181 -t wurstmeister/zookeeper
~~~
## Kafka Cluster
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
## 效果测试
~~~

~~~
转载：https://blog.csdn.net/u011651342/article/details/127096588
## docker-compose zookeeper集群+kafka集群
#### zookeeper集群
/data/zookeeper/zoo1/config/zoo.cfg
~~~
# The number of milliseconds of each tick
tickTime=2000
# The number of ticks that the initial
# synchronization phase can take
initLimit=10
# The number of ticks that can pass between
# sending a request and getting an acknowledgement
syncLimit=5
# the directory where the snapshot is stored.
# do not use /tmp for storage, /tmp here is just
# example sakes.
# dataDir=/opt/zookeeper-3.4.13/data
dataDir=/data
dataLogDir=/datalog
# the port at which the clients will connect
clientPort=2181
# the maximum number of client connections.
# increase this if you need to handle more clients
#maxClientCnxns=60
#
# Be sure to read the maintenance section of the
# administrator guide before turning on autopurge.
#
# http://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_maintenance
#
# The number of snapshots to retain in dataDir
autopurge.snapRetainCount=3
# Purge task interval in hours
# Set to "0" to disable auto purge feature
autopurge.purgeInterval=1
 
server.1=zoo1:2888:3888
server.2=zoo2:2888:3888
server.3=zoo3:2888:3888
~~~
~~~
docker network ls #查看当前网络
docker network create --subnet=172.18.0.0/16 mynetwork #创建子网段为172.18.0.0/16 的IP网络
~~~
docker-compose-zookeeper.yml
~~~yaml
version: '3.7'
services:
  zoo1:
    container_name: zoo1
    hostname: zoo1
    image: wurstmeister/zookeeper
    privileged: true
    restart: unless-stopped
    ports:
      - 2181:2181
    volumes: # 挂载数据卷
      - /data/zookeeper/zoo1/config/zoo.cfg:/opt/zookeeper-3.4.13/conf/zoo.cfg
      - /data/zookeeper/zoo1/data:/data
      - /data/zookeeper/zoo1/datalog:/datalog
    environment:
      TZ: Asia/Shanghai
      ZOO_MY_ID: 1 # 节点ID
      ZOO_SERVERS: server.1=zoo1:2888:3888 server.2=zoo2:2888:3888 server.3=zoo3:2888:3888 # zookeeper节点列表
    networks:
      mynetwork:
        ipv4_address: 172.18.0.4
      
  zoo2:
    container_name: zoo2
    hostname: zoo2
    image: wurstmeister/zookeeper
    privileged: true
    restart: unless-stopped
    ports:
      - 2182:2181
    volumes: # 挂载数据卷
      - /data/zookeeper/zoo2/config/zoo.cfg:/opt/zookeeper-3.4.13/conf/zoo.cfg
      - /data/zookeeper/zoo2/data:/data
      - /data/zookeeper/zoo2/datalog:/datalog
    environment:
      TZ: Asia/Shanghai
      ZOO_MY_ID: 2 # 节点ID
      ZOO_SERVERS: server.1=zoo1:2888:3888 server.2=zoo2:2888:3888 server.3=zoo3:2888:3888 # zookeeper节点列表
    networks:
      mynetwork:
        ipv4_address: 172.18.0.5
        
  zoo3:
    container_name: zoo3
    hostname: zoo3
    image: wurstmeister/zookeeper
    privileged: true
    restart: unless-stopped
    ports:
      - 2183:2181
    volumes: # 挂载数据卷
      - /data/zookeeper/zoo3/config/zoo.cfg:/opt/zookeeper-3.4.13/conf/zoo.cfg
      - /data/zookeeper/zoo3/data:/data
      - /data/zookeeper/zoo3/datalog:/datalog
    environment:
      TZ: Asia/Shanghai
      ZOO_MY_ID: 3 # 节点ID
      ZOO_SERVERS: server.1=zoo1:2888:3888 server.2=zoo2:2888:3888 server.3=zoo3:2888:3888 # zookeeper节点列表
    networks:
      mynetwork:
        ipv4_address: 172.18.0.6
        
networks:
  mynetwork:
    external:
      name: mynetwork
~~~
~~~bash
docker-compose -f docker-compose-zookeeper.yml up -d
~~~

#### kafka集群
创建虚拟机网络
~~~
docker network create -d bridge --subnet 172.19.0.0/24 kafka_net
~~~
docker-compose-kafka.yml
~~~yaml
version: '3.2'
services:
  broker1:
    container_name: broker1
    hostname: broker1
    image: wurstmeister/kafka
    privileged: true
    restart: unless-stopped
    ports:
      - "9986:9986"
      - "9091:9091"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_LISTENERS: PLAINTEXT://:9091
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://172.16.12.163:9091
      KAFKA_ADVERTISED_HOST_NAME: 172.16.12.163
      KAFKA_ADVERTISED_PORT: 9091
      KAFKA_ZOOKEEPER_CONNECT: 172.16.12.130:2181,172.16.12.130:2182,172.16.12.130:2183
      JMX_PORT: 9986
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /data/kafka/broker1:/kafka/kafka-logs-broker1
    networks:
      default:
        ipv4_address: 172.19.0.11
 
  broker2:
    container_name: broker2
    hostname: broker2
    image: wurstmeister/kafka
    privileged: true
    restart: unless-stopped
    ports:
      - "9987:9987"
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 2
      KAFKA_LISTENERS: PLAINTEXT://:9092
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://172.16.12.163:9092
      KAFKA_ADVERTISED_HOST_NAME: 172.16.12.163
      KAFKA_ADVERTISED_PORT: 9092
      KAFKA_ZOOKEEPER_CONNECT: 172.16.12.130:2181,172.16.12.130:2182,172.16.12.130:2183
      JMX_PORT: 9987
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /data/kafka/broker2:/kafka/kafka-logs-broker2
    networks:
      default:
        ipv4_address: 172.19.0.12
 
  broker3:
    container_name: broker3
    hostname: broker3
    image: wurstmeister/kafka
    privileged: true
    restart: unless-stopped
    ports:
      - "9988:9988"
      - "9093:9093"
    environment:
      KAFKA_BROKER_ID: 3
      KAFKA_LISTENERS: PLAINTEXT://:9093
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://172.16.12.163:9093
      KAFKA_ADVERTISED_HOST_NAME: 172.16.12.163
      KAFKA_ADVERTISED_PORT: 9093
      KAFKA_ZOOKEEPER_CONNECT: 172.16.12.130:2181,172.16.12.130:2182,172.16.12.130:2183
      JMX_PORT: 9988
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /data/kafka/broker3:/kafka/kafk-logs-broker3
    networks:
      default:
        ipv4_address: 172.19.0.13
 
  kafka-manager:
    image: sheepkiller/kafka-manager:latest
    container_name: kafka-manager
    hostname: kafka-manager
    restart: unless-stopped
    ports:
      - 9000:9000
    links:      # 连接本compose文件创建的container
      - broker1
      - broker2
      - broker3
 
    environment:
      ZK_HOSTS: 172.16.12.130:2181,172.16.12.130:2182,172.16.12.130:2183
      KAFKA_BROKERS: broker1:9091,broker2:9092,broker3:9093
      APPLICATION_SECRET: 123456
      KM_ARGS: -Djava.net.preferIPv4Stack=true
    networks:
      default:
        ipv4_address: 172.19.0.14
 
networks:
  default:
    external:
      name: kafka_net
~~~
