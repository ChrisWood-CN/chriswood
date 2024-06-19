---
title: docker镜像构建方式
date: 2023-02-08 11:04:06
categories: docker
tags:
  - docker
---

创建镜像的方法主要有三种：

- 基于已有镜像的容器创建
- 基于本地模板导入
- 基于 Dockerfile 创建（\*推荐）

## 一、基于容器创建镜像

基于已有容器构建镜像主要是通过 docker commit 命令来构建新的镜像，语法规则如下：

```shell
docker commit [OPTIONS] CONTAINER [REPOSITORY:TAG]
docker commit -m "centos7+java8+zh" -a "chriswoodcn" 4b40b9568be3 centos7_java8_zh:1.0.0
# 上面-m选项指定了新镜像的提交信息，-a标注作者信息，4b40b9568be3是容器ID，centos7_java8_zh:1.0.0是指定的新镜像名称和版本。
```

## 二、基于本地模板导入

用户也可以从模板文件中导入镜像，主要使用 docker import 命令

```shell
# 创造出一个模板，即 将容器导入到一个模板文件中
docker export 4b40b9568be3 > /root/centos7_java8_zh.tar
# 利用模板导入成镜像
docker import /root/centos7_java8_zh.tar chriswoodcn/centos7_java8_zh:1.0
docker images
# REPOSITORY                        TAG                 IMAGE ID            CREATED             SIZE
# chriswoodcn/centos7_java8_zh      1.0              498afccbfb2d        5 seconds ago          560MB
```

## 三、基于 Dockerfile 构建

基于 Dockerfile 构建镜像就目前而言是使用最为广泛的 Dockerfile 是由一组指令组成的文件，其每条指令对应 Linux 中的一条命令，Docker 程序通过读取 Dockerfile 中的指令最终生成镜像。

| 指令                                  | 含义                                                                                           |
| :------------------------------------ | :--------------------------------------------------------------------------------------------- |
| FROM 镜像名称                         | 指定新镜像基于的镜像，第一条指令必须为 FROM 指令                                               |
| MAINTAINER 名字                       | 镜像维护人信息                                                                                 |
| RUN 命令                              | 在基于的镜像上执行命令，并提交到新镜像中，可以多条                                             |
| CMD["要运行的程序","参数 1","参数 2"] | 指定启动容器时要执行的命令或者脚本 Dockerfile 只能有一条 CMD 命令 不可以追加命令               |
| EXPOSE 端口号                         | 指定新镜像加载到 docker 时要开启的端口号                                                       |
| ENV 环境变量 变量值                   | 设置环境变量 后面可以使用 可以多个                                                             |
| ADD 源文件/目录 目标文件/目录         | 将源文件复制到目标文件                                                                         |
| COPY 源文件/目录 目标文件/目录        | 将主机上的文件/目录复制到目标地点                                                              |
| VOLUME["目录"]                        | 在容器中创建一个挂载点                                                                         |
| USER 用户名/UID                       | 指定运行容器时的用户                                                                           |
| WORKDIR 路径                          | 为后续的 RUN、CMD、ENTRYPOINT 指定工作目录                                                     |
| ONBUILD 命令                          | 指定所生成的镜像作为一个基础镜像时所要运行的命令                                               |
| HEALTHCHECK                           | 健康检查                                                                                       |
| ENTRYPOINT                            | 指定镜像的默认入口命令，该入口命令会在启动容器时作为根命令执行，所有其他传入值作为该命令的参数 |

- ENTRYPOINT 写法
  1. exec 格式 -> ENTRYPOINT ["executable", "param1", "param2"]
  2. shell 格式 -> ENTRYPOINT command param1 param2
- CMD 和 ENTRYPOINT 区别

```shell
CMD                   # 指定这个容器启动的时候要运行的命令，不可以追加命令
ENTRYPOINT            # 指定这个容器启动的时候要运行的命令，可以追加命令
```

- 当指定了 ENTRYPOINT 后，CMD 的含义就发生了改变，不再是直接的运行其命令，而是将 CMD 的内容作为参数传给 ENTRYPOINT 指令

```shell
<ENTRYPOINT> "<CMD>"
```

```dockerfile
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
```

```shell
docker build -f dockerfile -t fitness-server:1.0.0 .
```

## 四、将本地 Docker 镜像上传到 Docker Hub 上

1.创建并登录https://hub.docker.com/

```shell
docker login --username=chriswoodcn
# 提示输入密码，正确输入密码后，提示Login Succeeded
```

2.构建镜像

```shell
docker build -f centos7_java8_zh_dockerfile -t chriswoodcn/centos7_java8_zh  .
```

3.网页登录 Docker Hub，创建仓库 chriswoodcn/centos7_java8_zh 4.给镜像打标签

```shell
docker tag chriswoodcn/centos7_java8_zh chriswoodcn/centos7_java8_zh:1.1.0
```

5.上传镜像到 Docker Hub 上

```shell
docker push chriswoodcn/centos7_java8_zh:1.1.0
```

### 五、多阶段构建

多阶段构建指在 Dockerfile 中使用多个 FROM 语句，每个 FROM 指令都可以使用不同的基础镜像，并且是一个独立的子构建阶段。 使用多阶段构建打包 Java 应用具有构建安全、构建速度快、镜像文件体积小等优点

```dockerfile
#例子
#First statge : define basic image for build
FROM maven:3.6.0-jdk-8-alpine AS mj
#add pom.xml and source code
ADD ./pom.xml pom.xml
ADD ./src src/
#build code and generate jar package
RUN mvn clean package

#Second stage: define mini image of java
From openjdk:8-jre-alpine
#copy jar from the first stage
COPY --from=mj target/my-app-1.0-SNAPSHOT.jar my-app-1.0-SNAPSHOT.jar
#expose service port
EXPOSE 8080
#start service
CMD ["java", "-jar", "my-app-1.0-SNAPSHOT.jar"]
```
