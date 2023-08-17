---
title: linux上ssh证书登录配置
date: 2023-08-17 07:55:08
categories: linux
tags:
- ssh
- linux
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
