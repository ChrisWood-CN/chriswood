---
title: docker-repository
date: 2023-02-09 11:12:06
categories: docker-repository
tags: docker-repository
---
## alpine_java8_zh
### v1.0.0
#### 1.dockerfile
~~~dockerfile
FROM openjdk:8-jdk-alpine

# 添加timeZone
RUN echo 'http://mirrors.ustc.edu.cn/alpine/v3.9/main' > /etc/apk/repositories \
 && echo 'http://mirrors.ustc.edu.cn/alpine/v3.9/community' >>/etc/apk/repositories \
 && apk --no-cache add tzdata \
 && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
 && echo "Asia/Shanghai" > /etc/timezone
# 清理临时文件要在 同一个RUN命令内进行， rm -rf .....，构建的时候每个RUN都会创建一个临时的容器，只有写在同一个RUN下才会在一个容器内执行
RUN apk --no-cache add ca-certificates wget && \
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.35-r0/glibc-2.35-r0.apk && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.35-r0/glibc-bin-2.35-r0.apk && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.35-r0/glibc-i18n-2.35-r0.apk && \
    apk add glibc-bin-2.35-r0.apk glibc-i18n-2.35-r0.apk glibc-2.35-r0.apk && \
    rm -rfv glibc-bin-2.35-r0.apk glibc-i18n-2.35-r0.apk glibc-2.35-r0.apk
# locale.md 见下面的内容
COPY ./locale.md /locale.md
RUN cat locale.md | xargs -i /usr/glibc-compat/bin/localedef -i {} -f UTF-8 {}.UTF-8 && \
    rm -rfv locale.md

ENV LANG=en_US.UTF-8 \
    LANGUAGE=en_US.UTF-8
~~~
#### 2.locale.md
~~~markdown
en_AG
en_AU
en_BW
en_CA
en_DK
en_GB
en_HK
en_IE
en_IN
en_NG
en_NZ
en_PH
en_SG
en_US
en_ZA
en_ZM
en_ZW
zh_CN
zh_HK
zh_SG
zh_TW
zu_ZA
~~~
#### 3.构建及验证
~~~shell
# 打包通过构建文件构建的镜像
docker build -f alpine_java8_zh -t chriswoodcn/alpine_java8_zh:1.0.0
# 创建容器aj1
docker run  --name aj1 -dit chriswoodcn/alpine_java8_zh:1.0.0
# 进入容器aj1
docker exec -it aj1 /bin/sh
# 验证locale是否设置成功
/usr/glibc-compat/bin/locale -a
#...
#zh_CN.utf8
#zh_HK.utf8
#zh_SG.utf8
#zh_TW.utf8
#zu_ZA.utf8
#...
~~~
