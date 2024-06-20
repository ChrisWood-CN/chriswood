---
title: Linux上ssh证书登录配置
date: 2023-08-17 07:55:08
updated: 2024-06-20 09:17:20
categories: Linux
tags:
  - ssh
  - Linux
---

# centos7 配置 ssh 证书登录

1.在/root/.ssh 目录下创建 rsa 密钥对，生成的 id_rsa（私钥）下载到本地，证书登录时需要用，id_rsa.pub（公钥）

```shell
mkdir -p ~/.ssh
chmod 0700 .ssh
cd ~/.ssh
```

```shell
ssh-keygen -t rsa -b 4096
```

> 生成的文件为默认文件名（id_rsa），如想要命名成自己想要的，可在以上命令后面加上 -f 你的文件名

2.生成的公钥内容复制到 authorized_keys 文件中，再设置 authorized_keys 文件权限为 600 或 644

```shell
cp id_rsa.pub authorized_keys
chmod 0600 authorized_keys
```

3.修改配置文件，/etc/ssh/sshd_config

```shell
vim /etc/ssh/sshd_config
```

```text
PermitRootLogin yes
//是否允许root账号登录，yes=允许，no=不允许，without-password=不允许通过密码ssh登陆，forced-commands-only=可以登录，但是登陆后不能进入交互，而是执行指定的命令后 自动退出
PasswordAuthentication no
//如果要禁用密码登录需要把PasswordAuthentication设置为no,未验证完证书是否能正常登录时，请不要设置成no
StrictModes no
//是否严格模式
RSAAuthentication yes
//启用 RSA 认证，默认为yes
PubkeyAuthentication yes
//启用公钥认证，默认为yes
AuthorizedKeysFile ~/.ssh/authorized_keys
//指定公钥所存放的位置，如果是想要有多个密钥对，可以参考下面写法，切不可在同一个文件里面放多个公钥，到时有麻烦事
//AuthorizedKeysFile ~/.ssh/authorized_keys1 ~/.ssh/authorized_keys2 ~/.ssh/authorized_keys3
//多个密钥对写法，这些文件中放的都是公钥内容，扩展名为.pub的文件，另外要注意，这些文件在你修改当前配置文件之前，最好将authorized_keys1这些公钥文件提前设置好
# AuthorizedKeysFile      .ssh/authorized_keys
```

4.重启服务，使更改生效

```shell
systemctl restart sshd
```

# ubuntu 配置 ssh 证书登录

1.安装 ssh 服务

```shell
sudo apt-update
sudo apt install openssh-server
sudo systemctl status ssh
sudo ufw allow ssh
```

2.剩余步骤参考 [centos7 配置 ssh 证书登录](#centos7配置ssh证书登录)

### 参考

1. [https://blog.csdn.net/zhangweixbl4/article/details/135106258](https://blog.csdn.net/zhangweixbl4/article/details/135106258)
2. [https://www.jianshu.com/p/6e8d70c4d820](https://www.jianshu.com/p/6e8d70c4d820)
