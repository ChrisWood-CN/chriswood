---
title: docker环境部署集群前后端分离项目
date: 2022-10-12 16:05:29
categories: docker
tags: docker
---
# docker环境部署集群前后端分离项目
## 一、基础
### 1.Docker虚拟机常用命令
1.先更新软件包
```shell script
yum -y update
```
2.安装Docker虚拟机
```shell script
yum install -y docker
```
3.运行、重启、关闭Docker虚拟机
```shell script
service docker start
service docker start
service docker stop
```
4.搜索镜像
```shell script
docker search 镜像名称
```
5.下载镜像
```shell script
docker pull 镜像名称
```
6.查看镜像
```shell script
docker images
```
7.删除镜像
```shell script
docker rmi 镜像名称
```
8.运行容器
```shell script
docker run 启动参数  镜像名称
```
9.查看容器列表
```shell script
docker ps -a
```
10.停止、挂起、恢复容器
```shell script
docker stop 容器ID
docker pause 容器ID
docker unpase 容器ID
```
11.查看容器信息
```shell script
docker inspect 容器ID
```
12.删除容器
```shell script
docker rm 容器ID
```
13.数据卷管理
```shell script
docker volume create 数据卷名称  #创建数据卷
docker volume rm 数据卷名称  #删除数据卷
docker volume inspect 数据卷名称  #查看数据卷
```
14.网络管理
```shell script
docker network ls 查看网络信息
docker network create --subnet=网段 网络名称
docker network rm 网络名称
```
15.避免VM虚拟机挂起恢复之后，Docker虚拟机断网
```shell script
vi /etc/sysctl.conf
```
文件中添加`net.ipv4.ip_forward=1`这个配置
```shell script
#重启网络服务
systemctl  restart network
```
### 2.PXC集群
1.安装PXC镜像
```shell script
docker pull percona/percona-xtradb-cluster
# 镜像名称太长，修改一下
docker tag percona/percona-xtradb-cluster pxc
# 删除之前的
docker rmi percona/percona-xtradb-cluster
```
2.创建内部网络
```shell script
docker network create --subnet=172.18.0.0/16 net1
# 查看net1网段：
docker inspect net1
# 如果要删除使用删除命令
docker network rm net1
```
3.创建数据卷
> 因为pxc不支持映射目录，所以采用映射数据卷的方式。创建数据卷叫v1，这里5个节点，所以创建5个数据卷：
```shell script
docker volume create --name v1
docker volume create --name v2
docker volume create --name v3
docker volume create --name v4
docker volume create --name v5
# 查看v1数据卷在宿主机的位置
docker inspect v1
# 删除数据卷v1
docker volume rm v1
```
4.创建备份数据卷（用于热备份数据）
```shell script
docker volume create --name backup
```
5.创建5节点的PXC集群
> 注意，每个MySQL容器创建之后，因为要执行PXC的初始化和加入集群等工作，
> 耐心等待1分钟左右再用客户端连接MySQL。另外，必须第1个MySQL节点启动成功，
> 用MySQL客户端能连接上之后，再去创建其他MySQL节点。

>命令参数说明：端口3306，密码123456，集群名称PXC，同步数据密码123456，映射数据目录到宿主机的v1数据卷，给予最高权限，名称叫node1，网段为net1，ip指定为172.18.0.2，运行的镜像是pxc。
```shell script
#创建第1个MySQL节点
docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -e CLUSTER_NAME=PXC -e XTRABACKUP_PASSWORD=123456 -v v1:/var/lib/mysql -v backup:/data --privileged --name=node1 --net=net1 --ip 172.18.0.2 pxc
#创建第2个MySQL节点
docker run -d -p 3307:3306 -e MYSQL_ROOT_PASSWORD=123456 -e CLUSTER_NAME=PXC -e XTRABACKUP_PASSWORD=123456 -e CLUSTER_JOIN=node1 -v v2:/var/lib/mysql --privileged --name=node2 --net=net1 --ip 172.18.0.3 pxc
#创建第3个MySQL节点
docker run -d -p 3308:3306 -e MYSQL_ROOT_PASSWORD=123456 -e CLUSTER_NAME=PXC -e XTRABACKUP_PASSWORD=123456 -e CLUSTER_JOIN=node1 -v v3:/var/lib/mysql --privileged --name=node3 --net=net1 --ip 172.18.0.4 pxc
#创建第4个MySQL节点
docker run -d -p 3309:3306 -e MYSQL_ROOT_PASSWORD=123456 -e CLUSTER_NAME=PXC -e XTRABACKUP_PASSWORD=123456 -e CLUSTER_JOIN=node1 -v v4:/var/lib/mysql --privileged --name=node4 --net=net1 --ip 172.18.0.5 pxc
#创建第5个MySQL节点
docker run -d -p 3310:3306 -e MYSQL_ROOT_PASSWORD=123456 -e CLUSTER_NAME=PXC -e XTRABACKUP_PASSWORD=123456 -e CLUSTER_JOIN=node1 -v v5:/var/lib/mysql --privileged --name=node5 --net=net1 --ip 172.18.0.6 pxc
```
> 验证PXC集群: navicat或者其他工具连接5个数据库节点,在DB1中新建一个数据库一张表并插入数据，提交后，看其它四个节点是否同步。

6.安装Haproxy镜像
```shell script
docker pull haproxy
```
7.宿主机上编写Haproxy配置文件
```shell script
vi /home/soft/haproxy/haproxy.cfg 
#vi /data/software/haproxy/haproxy.cfg
```
配置文件如下：
```shell script
global
	#工作目录
	chroot /usr/local/etc/haproxy
	#日志文件，使用rsyslog服务中local5日志设备（/var/log/local5），等级info
	log 127.0.0.1 local5 info
	#守护进程运行
	daemon

defaults
	log	global
	mode	http
	#日志格式
	option	httplog
	#日志中不记录负载均衡的心跳检测记录
	option	dontlognull
    #连接超时（毫秒）
	timeout connect 5000
    #客户端超时（毫秒）
	timeout client  50000
	#服务器超时（毫秒）
    timeout server  50000

#监控界面	
listen  admin_stats
	#监控界面的访问的IP和端口
	bind  0.0.0.0:8888
	#访问协议
    mode        http
	#URI相对地址
    stats uri   /dbs
	#统计报告格式
    stats realm     Global\ statistics
	#登陆帐户信息
    stats auth  admin:123456
#数据库负载均衡
listen  proxy-mysql
	#访问的IP和端口
	bind  0.0.0.0:3306  
    #网络协议
	mode  tcp
	#负载均衡算法（轮询算法）
	#轮询算法：roundrobin
	#权重算法：static-rr
	#最少连接算法：leastconn
	#请求源IP算法：source 
    balance  roundrobin
	#日志格式
    option  tcplog
	#在MySQL中创建一个没有权限的haproxy用户，密码为空。Haproxy使用这个账户对MySQL数据库心跳检测
    option  mysql-check user haproxy
    server  MySQL_1 172.18.0.2:3306 check weight 1 maxconn 2000  
    server  MySQL_2 172.18.0.3:3306 check weight 1 maxconn 2000  
	server  MySQL_3 172.18.0.4:3306 check weight 1 maxconn 2000 
	server  MySQL_4 172.18.0.5:3306 check weight 1 maxconn 2000
	server  MySQL_5 172.18.0.6:3306 check weight 1 maxconn 2000
	#使用keepalive检测死链
    option  tcpka  
```
> 注意：
1）、option部分，记得在MySQL创建一个没有权限的用户haproxy；CREATE USER 'haproxy'@'%' IDENTIFIED BY '';
2）、server部分，记得这里3306是容器的端口，不是宿主机的端口。

8.创建两个Haproxy容器
```shell script
#创建第1个Haproxy负载均衡服务器
docker run -it -d -p 4001:8888 -p 4002:3306 -v /home/soft/haproxy:/usr/local/etc/haproxy --name h1 --privileged --net=net1 --ip 172.18.0.7 haproxy
#进入h1容器，启动Haproxy
docker exec -it h1 bash
haproxy -f /usr/local/etc/haproxy/haproxy.cfg
#创建第2个Haproxy负载均衡服务器
docker run -it -d -p 4003:8888 -p 4004:3306 -v /home/soft/haproxy:/usr/local/etc/haproxy --name h2 --privileged --net=net1 --ip 172.18.0.8 haproxy
#进入h2容器，启动Haproxy
docker exec -it h2 bash
haproxy -f /usr/local/etc/haproxy/haproxy.cfg
```
9.Haproxy容器内安装Keepalived，设置虚拟IP
>注意事项：云主机不支持虚拟IP，另外很多公司的网络禁止创建虚拟IP（回家创建）,还有宿主机一定要关闭防火墙和SELINUX，很多同学因为这个而失败的，切记
```shell script
#进入h1容器
docker exec -it h1 bash
#更新软件包
apt-get update
#安装VIM
apt-get install vim
#安装Keepalived
apt-get install keepalived
#编辑Keepalived配置文件（参考下方配置文件）
vim /etc/keepalived/keepalived.conf
#启动Keepalived
service keepalived start
#宿主机执行ping命令
ping 172.18.0.201
```
配置文件内容如下
```shell script
vrrp_instance  VI_1 {
       state  MASTER
       interface  eth0
       virtual_router_id  51
       priority  100
       advert_int  1
       authentication {
           auth_type  PASS
           auth_pass  123456
       }
       virtual_ipaddress {
           172.18.0.201
       }
   }
```
