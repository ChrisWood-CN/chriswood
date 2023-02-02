---
title: kafka学习
date: 2023-02-02 16:21:26
categories:
- kafka
- zookeeper
tags:
- kafka
- zookeeper
---
## 安装启动ZooKeeper（单机模式）
1.下载解压 
[镜像地址](https://mirrors.tuna.tsinghua.edu.cn/apache/zookeeper/)下载zookeeper，tar -zxvf 解压至/opt
2.配置环境变量
~~~
vim /etc/profile

export ZOOKEEPER_HOME=/opt/apache-zookeeper-3.8.1-bin
export PATH=$ZOOKEEPER_HOME/bin:$PATH

source /etc/profile
~~~
3.修改ZooKeeper配置文件
~~~
cd /opt/apache-zookeeper-3.8.1-bin/conf
cp zoo_sample.cfg zoo.cfg

mkdir /tmp/zookeeper/data
mkdir /tmp/zookeeper/log

vim zoo.cfg

# zookeeper服务器心跳时间 单位ms
tickTime=2000
# 投票选举新leader的初始化时间
initLimit=10
#leader 与 follower心跳检测最大容忍时间，超过syncLimit*tickTime leader认为follower挂掉，从服务器列表中删除follower
syncLimit=5
# 数据目录
dataDir=/tmp/zookeeper/data
# 日志目录
dataLogDir=/tmp/zookeeper/log
# zookeeper对外服务端口
clientPort=2181
~~~
4.创建myid文件并设置服务器编号
~~~
cd /tmp/zookeeper/data
vim myid
# 写入0 保存 退出
~~~
5.启动Zookeeper服务，并查看Zookeeper的服务状态
~~~
zkServer.sh start
zkServer.sh status
~~~

## 安装并启动Kafka（单机模式）
1.下载解压
[镜像地址](https://mirrors.tuna.tsinghua.edu.cn/apache/kafka/)kafka，tar -zxvf 解压至/opt
2.配置环境变量
~~~
vim /etc/profile

export KAFKA_HOME=/opt/kafka_2.12-2.8.2
export PATH=KAFKA_HOME/bin:$PATH

source /etc/profile
~~~
3.修改kafka配置文件
~~~
mkdir /tmp/kafka/log
cd /opt/kafka_2.12-2.8.2/config

vim server.properties

broker.id=0
listeners=PLAINTEXT://localhost:9092
log.dirs=/tmp/kafka/log
zookeeper.connect=localhost:2181/kafka
~~~
