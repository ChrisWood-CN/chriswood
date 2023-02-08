---
title: docker镜像构建方式
date: 2023-02-08 11:04:06
categories: docker
tags: docker
---
创建镜像的方法主要有三种：
- 基于已有镜像的容器创建
- 基于本地模板导入
- 基于Dockerfile创建

## 一、基于容器创建镜像
基于已有容器构建镜像主要是通过docker commit命令来构建新的镜像，语法规则如下：
~~~shell
docker commit [OPTIONS] CONTAINER [REPOSITORY:TAG]
docker commit -m "centos7+java8+zh" -a "chriswoodcn" 4b40b9568be3 centos7_java8_zh:1.0
# 上面-m选项指定了新镜像的提交信息，-a标注作者信息，4b40b9568be3是容器ID，centos7_java8_zh:1.0是指定的新镜像名称和版本。
~~~

## 二、基于本地模板导入
用户也可以从模板文件中导入镜像，主要使用docker import命令
~~~shell
# 创造出一个模板，即 将容器导入到一个模板文件中
docker export 4b40b9568be3 > /root/centos7_java8_zh.tar
# 利用模板导入成镜像
docker import /root/centos7_java8_zh.tar chriswoodcn/centos7_java8_zh:1.0
docker images
# REPOSITORY                        TAG                 IMAGE ID            CREATED             SIZE
# chriswoodcn/centos7_java8_zh      1.0              498afccbfb2d        5 seconds ago          560MB
~~~

## 三、基于Dockerfile构建
基于Dockerfile构建镜像就目前而言是使用最为广泛的
Dockerfile是由一组指令组成的文件，其每条指令对应Linux中的一条命令，Docker程序通过读取Dockerfile中的指令最终生成镜像。

| 指令 | 含义 |
| :----- | :----- |
| FROM 镜像名称 | 指定新镜像基于的镜像，第一条指令必须为FROM指令 |
| MAINTAINER 名字 | 镜像维护人信息 |
| RUN 命令 | 在基于的镜像上执行命令，并提交到新镜像中，可以多条 |
| CMD["要运行的程序","参数1","参数2"] | 指定启动容器时要执行的命令或者脚本  Dockerfile只能有一条CMD命令 不可以追加命令|
| EXPOSE 端口号 | 指定新镜像加载到docker时要开启的端口号 |
| ENV 环境变量 变量值 | 设置环境变量 后面可以使用 可以多个 |
| ADD 源文件/目录 目标文件/目录 | 将源文件复制到目标文件 |
| COPY 源文件/目录 目标文件/目录 | 将主机上的文件/目录复制到目标地点 |
| VOLUME["目录"] | 在容器中创建一个挂载点 |
| USER 用户名/UID | 指定运行容器时的用户 |
| WORKDIR 路径 | 为后续的RUN、CMD、ENTRYPOINT指定工作目录 |
| ONBUILD 命令 | 指定所生成的镜像作为一个基础镜像时所要运行的命令 |
| HEALTHCHECK | 健康检查 |
| ENTRYPOINT | 指定镜像的默认入口命令，该入口命令会在启动容器时作为根命令执行，所有其他传入值作为该命令的参数 |

- ENTRYPOINT写法 
    1. exec 格式 -> ENTRYPOINT ["executable", "param1", "param2"]
    2. shell 格式 -> ENTRYPOINT command param1 param2
- CMD 和 ENTRYPOINT 区别
~~~shell
CMD                   # 指定这个容器启动的时候要运行的命令，不可以追加命令
ENTRYPOINT            # 指定这个容器启动的时候要运行的命令，可以追加命令
~~~
- 当指定了 ENTRYPOINT 后，CMD 的含义就发生了改变，不再是直接的运行其命令，而是将 CMD 的内容作为参数传给 ENTRYPOINT 指令
~~~shell
<ENTRYPOINT> "<CMD>"
~~~
~~~dockerfile
#dockerfile
#指定父镜像
FROM centos:centos7
#指定维护者信息
MAINTAINER chriswoodcn 
RUN mkdir -p /fitness/server
RUN mkdir -p /fitness/server/logs
RUN mkdir -p /fitness/server/temp

WORKDIR /fitness/server

ENV SERVER_PORT=8080
ENV ACTIVE=dev

EXPOSE ${SERVER_PORT}

ADD ./target/fitness-admin.jar ./app.jar

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom", "-Dserver.port=${SERVER_PORT}","-jar","-Dspring.profiles.active=${ACTIVE}","-Dfile.encoding=UTF-8","app.jar"]
~~~
~~~shell
docker build -f dockerfile -t fitness-server:1.0.0
~~~
