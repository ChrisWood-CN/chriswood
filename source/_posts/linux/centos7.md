---
title: centos7
date: 2023-08-23 08:38:22
categories: centos7
tags:
- centos7
- Linux
---
## CentOS7.9安装
### 下载地址
https://mirrors.aliyun.com/centos/7.9.2009/isos/x86_64/CentOS-7-x86_64-DVD-2009.iso
### balenaEtcher
https://etcher.balena.io/
### Install CentOS 7
sudo yum update
sudo reboot
sudo init 6 应用新的内核升级
##查询端口占用线程
~~~shell
netstat -tunlp | grep 端口号
~~~
##更换国内源
### 华为云
~~~shell
sudo curl -o /etc/yum.repos.d/CentOS-Base.repo https://repo.huaweicloud.com/repository/conf/CentOS-7-reg.repo
yum clean all && yum makecache
~~~
## 配置静态IP
~~~shell
ip addr #查看网卡名
cd  /etc/sysconfig/network-scripts/
vi ifcfg-enp0s3 #编辑网卡配置

systemctl restart network
~~~
例子:ifcfg-enp0s3
~~~
HWADDR=00:E2:69:55:35:E8 #
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=none
#设置默认
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=enp1s0
UUID=48c2d384-610b-43a9-99db-c6f2294843bd
#开机启动
ONBOOT=yes
#ip地址
IPADDR=192.168.1.188
#掩码位数 代表掩码二进制一共多少个1
PREFIX=22
#路由地址
GATEWAY=192.168.1.3
DNS1=192.168.1.3
PEERDNS=no
~~~
