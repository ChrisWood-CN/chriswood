---
title: Linux上ssh证书登录配置
date: 2023-08-17 07:55:08
categories: Linux
tags:
- ssh
- Linux
---
centos的ssh证书登录
~~~shell
mkdir -p ~/.ssh
chmod 0700 .ssh
cd ~/.ssh
ssh-keygen -t rsa
cp id_rsa.pub authorized_keys
chmod 0600 authorized_keys
vim /etc/ssh/sshd_config
# PasswordAuthentication no 如果要禁用密码登录需要把PasswordAuthentication设置为no
# PermitRootLogin yes
# PubkeyAuthentication yes
# AuthorizedKeysFile      .ssh/authorized_keys
systemctl restart sshd
~~~
docker rm -f dev-fitness1
docker rmi -f registry.cn-shanghai.aliyuncs.com/taotaodev/fitness-server-dev:1.0.0
docker pull registry.cn-shanghai.aliyuncs.com/taotaodev/fitness-server-dev:1.0.0
docker run --name dev-fitness1 --restart always --network host -e "TZ=Asia/Shanghai" -e "LC_ALL=en_US.UTF-8" -e "LANG=en_US.UTF-8" -e "LANGUAGE=en_US:en" -e "SERVER_PORT=8300" -e "ACTIVE=dev"  -v /mydata/docker/server1/logs/:/fitness/server/logs/ -v /etc/localtime:/etc/localtime -d registry-vpc.cn-shanghai.aliyuncs.com/taotaodev/fitness-server-dev:1.0.0
nohup java -Djava.security.egd=file:/dev/./urandom -Dfile.encoding=UTF-8 -Dserver.port=8088 -jar -Dspring.profiles.active=dell app.jar > /dev/null 2>&1 
