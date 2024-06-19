---
title: docker-compose
date: 2023-03-02 10:09:40
updated: 2023-06-15 14:03:05
categories: docker
tags:
  - docker
  - docker-compose
---

# docker-compose

## 环境

云服务器 centOS 7.6 64 位

## docker-compose 安装

```shell
curl -L "https://github.com/docker/compose/releases/download/v2.15.1/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
docker-compose
# 验证docker-compose.yml文件
docker-compose config -q
# 拉取服务依赖的镜像
docker-compose pull nginx
# 创建并启动所有服务的容器
docker-compose up
# 列出工程中所有服务的容器
docker-compose ps
```

## docker-compose 命令

```
Define and run multi-container applications with Docker.

Usage:
  docker-compose [-f <arg>...] [options] [COMMAND] [ARGS...]
  docker-compose -h|--help

Options:
  -f, --file FILE             Specify an alternate compose file
                              (default: docker-compose.yml)
  -p, --project-name NAME     Specify an alternate project name
                              (default: directory name)
  --verbose                   Show more output
  --log-level LEVEL           Set log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
  --no-ansi                   Do not print ANSI control characters
  -v, --version               Print version and exit
  -H, --host HOST             Daemon socket to connect to

  --tls                       Use TLS; implied by --tlsverify
  --tlscacert CA_PATH         Trust certs signed only by this CA
  --tlscert CLIENT_CERT_PATH  Path to TLS certificate file
  --tlskey TLS_KEY_PATH       Path to TLS key file
  --tlsverify                 Use TLS and verify the remote
  --skip-hostname-check       Don't check the daemon's hostname against the
                              name specified in the client certificate
  --project-directory PATH    Specify an alternate working directory
                              (default: the path of the Compose file)
  --compatibility             If set, Compose will attempt to convert keys
                              in v3 files to their non-Swarm equivalent

Commands:
  build              构建或重建服务
  bundle             从compose配置文件中产生一个docker绑定
  config             验证并查看compose配置文件
  create             创建服务
  down               停止并移除容器、网络、镜像和数据卷
  events             从容器中接收实时的事件
  exec               在一个运行中的容器上执行一个命令
  help               获取命令的帮助信息
  images             列出所有镜像
  kill               通过发送SIGKILL信号来停止指定服务的容器
  logs               从容器中查看服务日志输出
  pause              暂停服务
  port               打印绑定的公共端口
  ps                 列出所有运行中的容器
  pull               拉取并下载指定服务镜像
  push               Push service images
  restart            重启YAML文件中定义的服务
  rm                 删除指定已经停止服务的容器
  run                在一个服务上执行一条命令
  scale              设置指定服务运行容器的个数
  start              在容器中启动指定服务
  stop               停止已运行的服务
  top                显示各个服务容器内运行的进程
  unpause            恢复容器服务
  up                 创建并启动容器
  version            显示Docker-Compose版本信息
```

### docker-compose 用法

```
docker-compose [-f <args>...] [options] [COMMAND] [ARGS...]
docker-compose [-f docker-compose.yml] up -d
```

### docker-compose pull

拉取服务依赖的镜像

```
docker-compose pull [options] [SERVICE...]
```

命令选项[options]

- --ignore-pull-failures 忽略拉取镜像过程中的错误
- --parallel 同时拉取多个镜像
- --quiet 拉取镜像过程中不打印进度信息

### docker-compose build

构建镜像，服务容器一旦构建后将会带上一个标记名称，可以随时在项目目录下运行 docker-compose build 来重新构建服务。

```
docker-compose build [options] [--build-arg key=val...] [SERVICE...]
```

命令选项[options]

- --compress 通过 gzip 压缩构建上下文环境
- --force-rm 删除构建过程中的临时容器
- --no-cache 构建镜像过程中不使用缓存
- --pull 始终尝试通过拉取操作来获取更新版本的镜像
- -m, --memory MEM 为构建的容器设置内存大小
- --build-arg key=val 为服务设置 build-time 变量

### docker-compose create

为服务创建容器

```
docker-compose create [options] [SERVICE...]
```

命令选项[options]

- --force-recreate 重新创建容器，即使配置和镜像没有改变，不兼容--no-recreate 参数。
- --no-recreate 如果容器已经存在则无需重新创建，不兼容--force-recreate 参数。
- --no-build 不创建镜像即使缺失
- --build 创建容器前生成镜像

### docker-compose exec

进入容器命令

```
docker-compose exec [options] SERVICE COMMAND [ARGS...]
eg: docker-compose exec --index=1 tomcat /bin/bash
```

命令选项[options]

- -d 分离模式，以后台守护进程运行命令。
- --privileged 获取特权
- -T 禁用分配 TTY，默认 docker-compose exec 分配 TTY。
- --index=index 当一个服务拥有多个容器时可通过该参数登录到该服务下的任何容器

### docker-compose run

针对服务运行一次性命令

```
docker-compose run [options] [-v VOLUME...] [-p PORT...] [-e KEY=VAL...] SERVICE [COMMAND] [ARGS...]
#启动web服务并bash作为其命令运行
eg: docker-compose run web bash
```

命令选项[options]

- -d 指定在后台以守护进程方式运行服务容器，不占用主进程
- --name NAME 给容器指定名字
- --entrypoint CMD 重写镜像的 entrypoint 命令
- -e KEY=VAL 设置能被多次使用的环境变量
- -l, --label KEY=VAL 添加标签
- --no-deps 设置不启动服务所链接的容器
- --rm 运行后删除容器. detached 模式会忽略
- -p, 将容器的端口发布到主机
- --service-ports 在启用服务端口并映射到主机的情况下运行命令
- --use-aliases 在容器连接到的网络中使用服务的网络别名。
- -v, --volume=[] 绑定装载卷（默认值[]）
- -T 禁用分配 TTY，默认 docker-compose exec 分配 TTY。
- -w, --workdir="" 容器内的工作目录

### docker-compose up

启动所有服务，会一次性完成 build 和 create 以及 run 命令的三个操作。

```
docker-compose up [options] [--scale SERVICE=NUM...] [SERVICE...]
```

命令选项[options]

- -d 指定在后台以守护进程方式运行服务容器，不占用主进程
- -no-color 设置不使用颜色来区分不同的服务器的控制输出
- -no-deps 设置不启动服务所链接的容器
- -force-recreate 设置强制重新创建容器，不能与--no-recreate 选项同时使用。
- --no-create 若容器已经存在则不再重新创建，不能与--force-recreate 选项同时使用。
- --no-build 设置不自动构建缺失的服务镜像
- --build 设置在启动容器前构建服务镜像
- --abort-on-container-exit 若任何一个容器被停止则停止所有容器，不能与选项-d 同时使用。
- -t, --timeout TIMEOUT 设置停止容器时的超时秒数，默认为 10 秒。
- --remove-orphans 设置删除服务中没有在 compose 文件中定义的容器
- --scale SERVICE=NUM 设置服务运行容器的个数，此选项将会负载在 compose 中通过 scale 指定的参数。

### docker-compose ps

列出当前的所有容器，需要注意的是必须在 docker-compose.yml 文件所在的目录下执行该命令

```
docker-compose ps [options] [SERVICE...]
```

### docker-compose down

停止和删除容器、网络、卷、镜像

```
docker-compose down [options] [SERVICE...]
```

命令选项[options]

- --rmi type
  - -rmi all 删除 compose 文件中定义的所有镜像
  - --rmi local 删除镜像名为空的镜像
- -v, --volumes 删除已经在 compose 文件中定义的和匿名的附在容器上的数据卷
- --remove-orphans 删除服务中没有在 compose 中定义的容器

### docker-compose restart

重启服务

```
docker-compose restart [options] [SERVICE...]
```

命令选项[options]

- -t, --timeout TIMEOUT 指定重启前停止容器的超时时长，默认为 10 秒

### docker-compose rm

删除所有停止状态的容器，推荐先执行 docker-compose stop 命令来停止容器。

```
ocker-compose rm [options] [SERVICE...]
```

命令选项[options]

- -f, --force 强制直接删除包含非停止状态的容器
- -v 删除容器所挂载的数据卷

### docker-compose start

启动已经存在的容器

```
docker-compose start [SERVICE...]
```

### docker-compose stop

停止已运行的服务

```
docker-compose stop [options] [SERVICE...]
```

### docker-compose logs

查看容器的日志

```
docker-compose logs [options] [SERVICE...]
```

### docker-compose pause

暂停一个服务容器

### docker-compose unpause

恢复处于暂停状态中的服务

### docker-compose kill

发送 SIGKILL 信号来强制停止服务容器，支持通过-s 参数来指定发送的信号。

### docker-compose config

验证并查看 compose 文件配置

```
docker-compose config [options]
```

命令选项[options]

- --resolve-image-digests 将镜像标签标记为摘要
- -q, --quiet 只验证配置不输出，当配置正确时不输出任何容器，当配置错误时输出错误信息。
- --services 打印服务名称，一行显示一个。
- --volumes 打印数据卷名称，一行显示一个。

### docker-compose port

显示某个容器端口所映射的公共端口

```
docker-compose port [options] SERVICE PRIVATE_PORT
```

命令选项[options]

- --protocol=proto 指定端口协议，默认为 TCP，可选 UDP。
- --index=index 若同一个服务存在多个容器，指定命令对象容器的索引序号，默认为 1

### docker-compose push

推送镜像到仓库

```
docker-compose push [options] [SERVICE...]
```

命令选项[options]

- --ignore-push-failure 忽略推送镜像过程中的错误

### docker-compose version

Docker Compose 版本信息

## Docker 五种网络模式与应用场景

bridge（默认）、host 、container 、none 和⾃定义（Macvlan）五种模式。

```yml
#指定容器的网络模式为host模式，与主机共享端口和ip，这样会占用宿主机的端口，宿主机的端口只能被这一个容器共享
network_mode: "host"
```

### bridge 模式

bridge 模式是 docker 的默认⽹络模式 ，当 Docker 进程启动时，会在主机上创建⼀个名为 docker0 的虚拟⽹桥，此主机上启动的 Docker 容器会连接到这个虚拟⽹桥上。
虚拟⽹桥的工作方式和物理交换机类似，这样主机上的所有容器就通过交换机连在了⼀个⼆层⽹络中。
从 docker0 ⼦⽹中分配⼀个 IP 给容器使⽤，并设置 docker0 的 IP 地址为容器的默认⽹关。
bridge 模式是 docker 的默认⽹络模式，不写–network 参数的话就是 bridge 模式，可以通过 -P 或 -p 参数来指定端⼝映射。

```shell
docker run --name tomcat -d -p 8088:8080 tomcat
```

特点：
隔离性好，会占⽤宿主机端⼝，只占⽤⼀个真实 IP，适⽤于⼤多数场景

### host 模式

使用 host 模式启动容器，该容器不会获得独立的 Network Namespace，而是和宿主机共同使用一个 Network Namespace，不会虚拟自己的网卡，配置自己的 ip 等，
而是使用宿主机的 ip 和端口，也就是会占用宿主机的端口。

```shell
docker run --name mytomcat --network=host -d tomcat
# tomcat容器默认使用的是8080端口，使用host模式，tomcat容器占用了主机的端口
curl http://localhost:8080
```

特点：隔离性最差，只占⽤⼀个真实 IP，会占⽤宿主机端⼝，会出现端⼝冲突，性能最好。能确认所有容器端⼝不冲突且默认都需要对外暴露时使⽤。

### container 模式

这个模式指定新创建的容器和已经存在的⼀个容器共享⼀个 Network Namespace，⽽不是和宿主机共享
新创建的容器不会创建⾃⼰的⽹卡和配置⾃⼰的 IP，⽽是和⼀个指定的容器共享 IP、端⼝范围等。 同样，两个容器除了⽹络⽅⾯，其他的如⽂件系统、进程列表等
还是隔离的。两个容器的进程可以通过 IO ⽹卡设备通信
例子: 采用 nginx 容器作为容器桥反射 tomcat 端口

```shell
docker run --name tomcat -d -p 80:80 tomcat
```

tomcat 默认暴露 8080 端⼝，这里利⽤ bridge 模式绑定 80 端⼝，本地访问失败，因为映射的容器端口是 80，然而 tomcat 的容器默认端口是 8080，所以访问不到
将 nginx 通过容器模式绑定到 tomcat 容器，这样通过 tomcat 容器的 80 端⼝便可转发给 nginx 处理

```shell
docker run -d --name nginx --net container:tomcat nginx
```

特点：隔离性好，只占⽤⼀个真实 IP，会占⽤容器端⼝，性能差，开发⽹关应⽤时可以考虑

### none 模式

在这种模式下，Docker 容器拥有自己的 Network Namespace，但是并不为 Docker 容器进行任何网络配置。 也就是说，这个 Docker 容器没有⽹卡、IP、路由等
信息。需要我们自己为 Docker 容器添加网卡、配置 IP 等。

```shell
docker run -it --net=none web
```

特点：一般用的比较少，⼀切全靠⾃定义，各项特性靠自己决定。

### macvlan 模式

#### Docker 的 Bridge 模式

docker 桥接模式是在单个主机上桥接运行的，无法实现多个宿主机通信，并且会占用主机的端口。
优点：兼容性好，是 Docker 默认的通信规则
缺点：主机端⼝占⽤严重，⽆法使⽤指定端⼝（如：80）
缺点：⽆法跨主机容器间通信

#### Macvlan 是什么

Docker 内置的 Macvlan 驱动（Windows 上是 Transparent）是为此场景而生。通过为容器提供 MAC 和 IP 地址，让容器在物理⽹络上成为"⼀等公⺠"。
因为⽆须端⼝映射或者额外桥接，可以直接通过主机接⼝（或者⼦接⼝）访问容器接⼝。
但是，Macvlan 的缺点是需要将主机网卡（NIC）设置为混杂模式（Promiscuous Mode），这在⼤部分公有云平台上是不允许的。所以 Macvlan 对于
公司内部的数据中心网络来说很棒（假设公司网络组能接受 NIC 设置为混杂模式），但是 Macvlan 在公有云上并不可行。 Macvlan 本身是 linux
kernel 模块，其功能是允许在同⼀个物理⽹卡上配置多个 MAC 地址，即多个 interface，每个 interface 可以配置⾃⼰的 IP。macvlan 本质上是⼀种
⽹卡虚拟化技术

#### Macvlan 操作步骤

##### 1.确认⽹卡名称 ifconfig

##### 2.开启混杂模式

> 不要轻易在 linux 服务器上执行，可以使用 vmware 新建 linux 虚拟机测试

```shell
ip link set ens33 promisc on
ifconfig ens33 promisc
```

##### 3.创建 Macvlan ⽹络

```shell
-d macvlan #指定⽹络模式
--subnet=192.168.31.0/24 #设置⼦⽹掩码
```

```shell
docker network create -d macvlan \
--subnet=192.168.31.0/24 \
--ip-range=192.168.31.0/24 \
--gateway=192.168.31.1 \
-o parent=ens33 \
macvlan32
# –ip-range=192.168.31.0/24 设置容器允许的IP范围
# –gateway=192.168.31.1 设置⽹关
# -o parent=ens33 设置上⼀级⽹卡（或虚拟⽹卡）名称
# macvlan32 指定当前macvlan⽹络名称
```

##### 4.加⼊ macvlan ⽹络

```
docker run -itd --name tomcat1 --ip=192.168.31.190 --network macvlan32 tomcat
docker run -itd --name tomcat2 --ip=192.168.31.191 --network macvlan32 tomcat
```

优点：

- 1、独⽴ IP，维护方便，不占用主机端口，使⽤容器默认端⼝
- 2、拥有稳定的 IP 后，容器间跨主机通信成为可能，因为⽆论是物理机、虚拟机、容器都是物理⽹络的“⼀等公⺠”，容器间通信时直接指定 IP 即可

缺点：

- 1、⽹络环境需要⽀持混杂模式，公有云不⽀持，不过都上公有云了，为什么不⽤直接⽤云供应商提供的容器服务呢？
- 2、部分⼤规模应⽤集群，内⽹ IP 地址是稀缺资源，例如阿⾥云、腾讯云，不适合使⽤ Macvlan
- 3、默认容器端⼝均对外暴露，需要在内⽹构建应⽤防⽕墙/⽹关决定哪些 IP 的哪些端⼝允许外界访问，哪些不允许

## 容器状态

```
created（已创建）
restarting（重启中）
running或up（运行中）
removing（迁移中）
paused（暂停）
exited（停止）
dead（死亡）
docker ps -a命令，可以查看全部已存在的容器
```

## docker-compose.yml 文件编写

> 参考：https://docs.docker.com/compose/compose-file/compose-file-v3/

### Compose 和 Docker 兼容性矩阵

docker-ce 版本和 compose 版本对应关系根据具体情况编辑

### docker swarm 上的 docker-compose 示例

```yaml
version: "3.9"
services:
  redis:
    image: redis:alpine
    ports:
      - "6379"
    networks:
      - frontend
    deploy:
      replicas: 2
      update_config:
        parallelism: 2
        delay: 10s
      restart_policy:
        condition: on-failure

  db:
    image: postgres:9.4
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - backend
    deploy:
      placement:
        max_replicas_per_node: 1
        constraints:
          - "node.role==manager"

  vote:
    image: dockersamples/examplevotingapp_vote:before
    ports:
      - "5000:80"
    networks:
      - frontend
    depends_on:
      - redis
    deploy:
      replicas: 2
      update_config:
        parallelism: 2
      restart_policy:
        condition: on-failure

  result:
    image: dockersamples/examplevotingapp_result:before
    ports:
      - "5001:80"
    networks:
      - backend
    depends_on:
      - db
    deploy:
      replicas: 1
      update_config:
        parallelism: 2
        delay: 10s
      restart_policy:
        condition: on-failure

  worker:
    image: dockersamples/examplevotingapp_worker
    networks:
      - frontend
      - backend
    deploy:
      mode: replicated
      replicas: 1
      labels: [APP=VOTING]
      restart_policy:
        condition: on-failure
        delay: 10s
        max_attempts: 3
        window: 120s
      placement:
        constraints:
          - "node.role==manager"

  visualizer:
    image: dockersamples/visualizer:stable
    ports:
      - "8080:8080"
    stop_grace_period: 1m30s
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
    deploy:
      placement:
        constraints:
          - "node.role==manager"

networks:
  frontend:
  backend:

volumes:
  db-data:
```

#### 基本配置选项

```yaml
services:
  webapp:
    build:
      context: .
      dockerfile: Dockerfile
      args: #添加构建参数，这些参数是只能在构建过程中访问的环境变量 使用数组或字典
        buildno: 1
        exportPort: 8888
      #      下面这种格式也可以
      #      - buildno=1
      #      - exportPort=8888
      labels: # 使用Docker标签将元数据添加到生成的镜像。使用数组或字典
        com.example.description: "Accounting webapp"
        com.example.department: "Finance"
      network: host #构建期间为 RUN 指令设置的网络
      target: prod #构建 Dockerfile中定义的指定阶段。参阅docker的多阶段构建文档
    configs: #配置必须已经存在或已在顶级配置配置中定义  docker swarm中才有
      - my_other_config
      - source: my_config
        target: /redis_config
        uid: "103" #在服务的任务容器中拥有已安装配置文件的数字 UID 或 GID。如果未指定，两者在 Linux 上均默认为 0
        gid: "103"
        mode: 0440 #八进制表示法在服务的任务容器中安装的文件的权限
    image: myimage:latest
    credential_spec:
      config: my_credential_spec
    container_name: my-web-container
    # deploy在swarm中生效
    # 这些只在普通docker中生效build，cgroup_parent，container_name，devices，tmpfs，external_links，links，
    # network_mode，restart，security_opt，userns_mode
    deploy: #指定与服务的部署和运行相关的配置
      endpoint_mode: vip #为连接到群的外部客户端指定服务发现方法
      # vip Docker为服务分配一个虚拟 IP (VIP)，充当客户端访问网络服务的前端
      # dnsrr  DNS轮询服务发现  Docker为服务设置 DNS条目，对服务名称的DNS查询返回IP地址列表，客户端直接连接到其中一个
      labels:
        com.example.description: "This label will appear on the web service"
      mode: replicated #global（每个集群节点一个容器）或replicated （指定数量的容器）。默认replicated
      replicas: 6 #在给定时间应该运行的容器数量
      placement: #指定约束和优先部署顺序
        max_replicas_per_node: 1 #如果服务是replicated（这是默认设置），则限制任何时候可以在节点上运行的副本数
        constraints:
          - "node.role==manager"
        preferences:
          - spread: node.labels.zone
      resources: #配置资源限制
        limits:
          cpus: "0.50"
          memory: 50M
        reservations:
          cpus: "0.25"
          memory: 20M
      update_config: #更新容器策略
        parallelism: 2 #一次执行的容器数，设置为0则全部一次执行
        delay: 10s
        failure_action: pause #失败后操作 continue pause
      rollback_config: #回滚容器策略
        parallelism: 2 #一次执行的容器数，设置为0则全部一次执行
        delay: 10s
        failure_action: pause #失败后操作 continue pause
      restart_policy: #重启容器策略
        condition: on-failure #none, on-failure or any (default: any).
        delay: 5s #重新启动尝试之间等待的时间过长
        max_attempts: 3 #最大尝试次数
        window: 120s #在决定重启是否成功之前等待多长时间
    depends_on:
      - db
      - redis

  redis:
    image: redis:latest
    container_name: redis

  db:
    image: postgres:latest
    container_name: db
    environment:
      POSTGRES_PASSWORD: 123456

  configs: #配置   docker swarm中才有
    my_config:
      file: ./my_config.txt
    my_other_config:
      external: true
```
