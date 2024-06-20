---
title: CentOS
date: 2023-08-23 08:38:22
categories: CentOS
tags:
  - CentOS
  - Linux
---

## CentOS7.9 安装

### 镜像下载地址

#### 阿里云镜像

https://mirrors.aliyun.com/centos/7.9.2009/isos/x86_64/CentOS-7-x86_64-Everything-2207-02.iso

### 制作 U 盘启动盘，balenaEtcher

https://etcher.balena.io/#download-etcher
https://etcher.balena.io/

### 安装系统

1. 在 UEFI 选项中选择 USB 设备
2. 启动后，选择 Install CentOS 7
3. 选最小安装，然后开始 CentOS 7 系统配置
4. 安装完启动
5. 安装 GNOME 图形界面(可选)

```shell
yum update -y
yum grouplist
# 安装GNOME图形界面
yum groupinstall -y "GNOME Desktop"
# 安装完成后，修改默认启动方式为图形化界面
systemctl set-default graphical.target
# 恢复为命令模式
# systemctl set-default multi-user.target
# 重启之后就会出现图形界面
sudo reboot

```

### 一些常用命令

1. 查询端口占用线程

```shell
netstat -tunlp | grep 端口号
```

2. yum 更换国内源

```shell
#华为云
sudo curl -o /etc/yum.repos.d/CentOS-Base.repo https://repo.huaweicloud.com/repository/conf/CentOS-7-reg.repo
yum clean all && yum makecache
```

3. 配置静态 IP

```shell
ip addr #查看网卡名
cd  /etc/sysconfig/network-scripts/
vi ifcfg-enp0s3 #编辑网卡配置

systemctl restart network
```

例子:ifcfg-enp0s3

```
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
```
