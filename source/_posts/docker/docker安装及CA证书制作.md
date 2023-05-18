---
title: docker安装及CA证书制作
date: 2023-03-01 15:37:24
categories: docker
tags: dockerCA证书
---
## 环境
云服务器centOS 7.6 64位
## 安装步骤
### docker安装
~~~shell
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
# 阿里云地址
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io
~~~
###docker卸载
~~~
rm -rf /etc/docker
rm -rf /run/docker
rm -rf /var/lib/dockershim
rm -rf /var/lib/docker

ps -ef|grep docker
kill -9 pid

yum list installed | grep docker
yum remove  containerd.io.x86_64

yum remove docker-ce.x86_64
yum remove docker-ce-cli.x86_64
yum remove docker-ce-rootless-extras.x86_64
yum remove docker-compose-plugin.x86_64
yum remove docker-scan-plugin.x86_64
~~~
### CA证书制作
~~~shell
# 创建文件夹
mkdir -p /mydata/certs/docker
cd /mydata/certs/docker
# 使用OpenSSL生成 CA 私钥和公钥文件
openssl genrsa -aes256 -out ca-key.pem 4096
openssl req -new -x509 -days 365 -key ca-key.pem -sha256 -out ca.pem
openssl genrsa -out server-key.pem 4096
# openssl req -subj "/CN=$HOST" -sha256 -new -key server-key.pem -out server.csr
# $HOST可以是服务器ip地址也可以是域名地址
openssl req -subj "/CN=124.221.83.80" -sha256 -new -key server-key.pem -out server.csr
# 使用 CA 签署公钥
# 允许所有IP远程访问，也可以只允许指定的IP访问 echo subjectAltName = DNS:$HOST,IP:10.10.10.20,IP:10.10.10.30 >> extfile.cnf
echo subjectAltName = IP:124.221.83.80,IP:0.0.0.0 >> extfile.cnf
# 将 Docker 守护程序密钥的扩展使用属性设置为仅用于服务器身份验证
echo extendedKeyUsage = serverAuth >> extfile.cnf
# 生成签名证书
openssl x509 -req -days 365 -sha256 -in server.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out server-cert.pem -extfile extfile.cnf

# 继续创建客户端密钥和证书签名请求
openssl genrsa -out key.pem 4096
openssl req -subj '/CN=client' -new -key key.pem -out client.csr

# 要使密钥适合客户端身份验证，请创建一个新的扩展配置文件
echo extendedKeyUsage = clientAuth >> extfile-client.cnf

# 现在，生成签名证书
openssl x509 -req -days 365 -sha256 -in client.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out cert.pem -extfile extfile-client.cnf

# 生成后cert.pem，server-cert.pem 可以安全地删除两个证书签名请求和扩展配置文件：
rm -v client.csr server.csr extfile.cnf extfile-client.cnf

# 默认umask值为 022，您的密钥对您和您的组来说是世界可读和可写的。为保护您的密钥免受意外损坏，请移除其写入权限。要使它们只能由您读取，请按如下方式更改文件模式
chmod -v 0400 ca-key.pem key.pem server-key.pem
chmod -v 0444 ca.pem server-cert.pem cert.pem

# 修改docker service
vim /lib/systemd/system/docker.service
# 修改ExecStart
ExecStart=/usr/bin/dockerd -H fd:// -H unix:///var/run/docker.sock --containerd=/run/containerd/containerd.sock --tlsverify --tlscacert=/mydata/certs/docker/ca.pem --tlscert=/mydata/certs/docker/server-cert.pem --tlskey=/mydata/certs/docker/server-key.pem -H tcp://0.0.0.0:2376
systemctl daemon-reload
service docker restart
service docker status
# 拷贝ca.pem key.pem cert.pem到需要远程登录的客户端
~~~
