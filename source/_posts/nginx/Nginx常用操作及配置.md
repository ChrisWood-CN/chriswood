---
title: Nginx常用操作及配置
date: 2022-09-30 23:24:15
categories: Nginx
tags: Nginx
---
# Nginx常用操作及配置

### 常用操作

``` shell
#强制停止Nginx
kill -9 nginx 
start nginx
nginx -s quit
nginx -s reload
```

### 常见配置

``` shell
# 进程数量
worker_processes 1;

events {
  # 最大连接数量
  worker_connections 1024;
}

http {
  include mime.types;
  default_type application/octet-stream;
  sendfile on;
  keepalive_timeout 65;

  # 演示如何强制http跳转https
  server {
    listen 80;
    server_name test.com;

    # http强制跳转到https
    rewrite ^(.*)$ https://$server_name$1 permanent;
  }

  # 演示如何配置微信支付的校验文件
  server {
    listen 80;
    server_name localhost;

    # 默认根路径
    location / {
      root index.html;
    }
    # 微信支付校验文件，可以直接配置访问名称
    location ^~/MP_verify_2g3uEjrB5B2LIbNl.txt {
      alias /home/MP_verify_2g3uEjrB5B2LIbNl.txt;
    }
    # 微信支付校验文件，也可以通过正则配置
    location ~^/MP_verify_[a-zA-Z0-9]*\.(txt)$ {
      root /home/;
      rewrite ^/home/(.txt)$ /home/$1 last;
    }
  }

  # 演示root和alias两种配置静态资源的区别
  server {
    listen 80;
    server_name localhost;

    # 用root方式，location中的路径会拼加到root的地址后面
    # 请求路径为：http://localhost:8080/files/index.jpg    实际访问为：/home/files/index.jpg
    location ~^/files/ {
      root /home/;
      index index.html index.htm;
    }
    # 用alias方式，location中的路径不会拼加到alias的地址后面
    # 这请求路径为：http://localhost:8080/files/index.jpg    实际访问为：/home/index.jpg
    location ~^/files/ {
      alias /home/;
      index index.html index.htm;
    }
  }

  # 演示请求后台接口代理配置
  server {
    listen 8080;
    server_name localhost;

    #################### 第一种场景 ####################
    # 请求路径为：http://127.0.0.1:8080/api/getUser   实际代理为：http://127.0.0.1:8000/api/getUser
    location ^~/api/ {
      proxy_pass http://127.0.0.1:8000;
      proxy_set_header Host $http_host; #后台可以获取到完整的ip+端口号
      proxy_set_header X-Real-IP $remote_addr; #后台可以获取到用户访问的真实ip地址
    }
    # 请求路径为：http://127.0.0.1:8080/api/getUser   实际指向为：http://127.0.0.1:8000/api/getUser
    location ^~/api {
      proxy_pass http://127.0.0.1:8000;
      proxy_set_header Host $http_host; #后台可以获取到完整的ip+端口号
      proxy_set_header X-Real-IP $remote_addr; #后台可以获取到用户访问的真实ip地址
    }

    #################### 第二种场景 ####################
    # 请求路径为：http://127.0.0.1:8080/api/getUser   实际代理为：http://127.0.0.1:8000/getUser
    location ^~/api/ {
      proxy_pass http://127.0.0.1:8000/;
      proxy_set_header Host $http_host; #后台可以获取到完整的ip+端口号
      proxy_set_header X-Real-IP $remote_addr; #后台可以获取到用户访问的真实ip地址
    }
    # 请求路径为：http://127.0.0.1:8080/api/getUser   实际代理为：http://127.0.0.1:8000//getUser
    location ^~/api {
      proxy_pass http://127.0.0.1:8000/;
      proxy_set_header Host $http_host; #后台可以获取到完整的ip+端口号
      proxy_set_header X-Real-IP $remote_addr; #后台可以获取到用户访问的真实ip地址
    }

    #################### 第三种场景 ####################
    # 请求路径为：http://127.0.0.1:8080/api/getUser   实际代理为：http://127.0.0.1:8000/user/getUser
    location ^~/api {
      proxy_pass http://127.0.0.1:8000/user;
      proxy_set_header Host $http_host; #后台可以获取到完整的ip+端口号
      proxy_set_header X-Real-IP $remote_addr; #后台可以获取到用户访问的真实ip地址
    }
    # 请求路径为：http://127.0.0.1:8080/api/getUser   实际代理为：http://127.0.0.1:8000/usergetUser
    location ^~/api/ {
      proxy_pass http://127.0.0.1:8000/user;
      proxy_set_header Host $http_host; #后台可以获取到完整的ip+端口号
      proxy_set_header X-Real-IP $remote_addr; #后台可以获取到用户访问的真实ip地址
    }

    #################### 第四种场景 ####################
    # 请求路径为：http://127.0.0.1:8080/api/getUser   实际代理为：http://127.0.0.1:8000/user/getUser
    location ^~/api/ {
      proxy_pass http://127.0.0.1:8000/user/;
      proxy_set_header Host $http_host; #后台可以获取到完整的ip+端口号
      proxy_set_header X-Real-IP $remote_addr; #后台可以获取到用户访问的真实ip地址
    }
    # 请求路径为：http://127.0.0.1:8080/api/getUser   实际代理为：http://127.0.0.1:8000/user//getUser
    location ^~/api {
      proxy_pass http://127.0.0.1:8000/user/;
      proxy_set_header Host $http_host; #后台可以获取到完整的ip+端口号
      proxy_set_header X-Real-IP $remote_addr; #后台可以获取到用户访问的真实ip地址
    }
  }

  # 演示前端项目部署加访问前缀的nginx配置
  server {
    listen 8090;
    server_name localhost;

    # 部署路径：/home/web/my_demo
    # 访问路径为：http://localhost:8090/
    location / {
      try_files $uri $uri/ /index.html;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header Host $http_host;
      root /home/web/my_demo/;
      index index.html index.htm;
    }

    # 部署路径：/home/web/my_demo
    # 访问路径为：http://localhost:8090/my_demo/
    # 如果location路径最后没有配置斜杠，则浏览器输入访问地址后，路径最后会自动拼一个斜杠
    location ^~/my_demo/ {
      try_files $uri $uri/ /my_demo/index.html;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header Host $http_host;
      root /home/web/;
      index index.html index.htm;
    }
  }
}
```

