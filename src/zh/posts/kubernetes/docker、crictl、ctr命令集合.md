---
title: docker、crictl、ctr命令集合
categories: kubernetes
tags:
  - docker
  - kubernetes
date: 2024-06-27 10:38:01
---

## docker、crictl、ctr 命令对比表格

| 方法                 | docker                                                              | crictl                                                                                                                    | ctr                                                                      |
| -------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 查看镜像列表         | docker images                                                       | crictl images                                                                                                             | ctr -n k8s.io i ls (默认的 namespace k8s.io)                             |
| 查看镜像详情         | docker inspect IMAGE ID                                             | crictl inspecti IMAGE ID                                                                                                  |
| 拉取镜像             | docker pull NAME[:TAG]                                              | crictl pull NAME[:TAG]                                                                                                    | ctr -n k8s.io i pull NAME[:TAG]                                          |
| 推送镜像             | docker push NAME[:TAG]                                              |                                                                                                                           | ctr -n k8s.io i push NAME[:TAG]                                          |
| 删除镜像             | docker rmi IMAGE ID                                                 | crictl rmi IMAGE ID                                                                                                       | ctr -n k8s.io i rm IMAGE ID                                              |
| 导入镜像             | docker load -i input-file.tar                                       |                                                                                                                           | ctr image import input-file.tar                                          |
| 导出镜像             | docker save -o output-tar-file.tar NAME[:TAG]                       |                                                                                                                           | ctr image export NAME[:TAG] output-tar-file.tar                          |
| 修改镜像标签         | docker tag IMAGE ID （or NAME）[:TAG] repository[:TAG]              |                                                                                                                           | ctr image tag IMAGE ID （or NAME）[:TAG] repository[:TAG]                |
| 查看容器列表         | docker ps                                                           | crictl ps                                                                                                                 | ctr task ls/ctr container ls                                             |
| 查看容器详情         | docker inspect CONTAINER ID                                         | crictl inspect CONTAINER ID                                                                                               | ctr container info CONTAINER ID                                          |
| 查看容器日志         | docker logs CONTAINER ID                                            | crictl logs CONTAINER ID                                                                                                  |                                                                          |
| 进入容器             | docker exec -it CONTAINER ID /bin/bash                              | crictl exec -it CONTAINER ID /bin/bash                                                                                    |                                                                          |
| 查看容器资源使用情况 | docker stats CONTAINER ID                                           | crictl stats CONTAINER ID                                                                                                 |                                                                          |
| 创建容器             | docker create -it --name my_container ubuntu:latest /bin/bash       | crictl create [CONTAINER_ID]                                                                                              | ctr container create my_container nginx:latest /path/to/bundle           |
| 停止容器             | docker stop CONTAINER ID                                            | crictl stop CONTAINER ID                                                                                                  |                                                                          |
| 删除容器             | docker rm CONTAINER ID                                              | crictl rm CONTAINER ID                                                                                                    | ctr -n k8s.io container delete CONTAINER ID                              |
| 运行新容器           | docker run --rm -it --network host docker.io/library/alpine /bin/sh |                                                                                                                           | ctr run --rm -t --net-host docker.io/library/alpine my_container /bin/sh |
| 查看 pod 列表        |                                                                     | crictl pods                                                                                                               |                                                                          |
| 启动 Pod             |                                                                     | crictl runp                                                                                                               |                                                                          |
| 停止 Pod             |                                                                     | crictl stopp                                                                                                              |                                                                          |
| 删除 Pod             |                                                                     | 1、crictl rmp POD-ID #已停止 pod 2、crictl rmp -f POD-ID# 即时 POD 未停止也强制删除 3、crictl rmp -a POD-ID# 删除全部 POD |
|                      |
