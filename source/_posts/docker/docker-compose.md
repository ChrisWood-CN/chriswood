---
title: docker-compose
date: 2023-03-02 10:09:40
categories: 
- docker
- docker-compose
tags:
- docker
- docker-compose
---
## 环境
云服务器centOS 7.6 64位
## docker-compose安装
~~~shell
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
~~~
## docker-compose命令
~~~
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
~~~
### docker-compose用法
~~~
docker-compose [-f <args>...] [options] [COMMAND] [ARGS...]
docker-compose [-f docker-compose.yml] up -d
~~~
### docker-compose pull
拉取服务依赖的镜像
~~~
docker-compose pull [options] [SERVICE...]
~~~
命令选项[options]
- --ignore-pull-failures 忽略拉取镜像过程中的错误
- --parallel 同时拉取多个镜像
- --quiet 拉取镜像过程中不打印进度信息
### docker-compose build
构建镜像，服务容器一旦构建后将会带上一个标记名称，可以随时在项目目录下运行docker-compose build来重新构建服务。
~~~
docker-compose build [options] [--build-arg key=val...] [SERVICE...]
~~~
命令选项[options]
- --compress 通过gzip压缩构建上下文环境
- --force-rm 删除构建过程中的临时容器
- --no-cache 构建镜像过程中不使用缓存 
- --pull 始终尝试通过拉取操作来获取更新版本的镜像 
- -m, --memory MEM为构建的容器设置内存大小 
- --build-arg key=val 为服务设置build-time变量
### docker-compose create
为服务创建容器
~~~
docker-compose create [options] [SERVICE...]
~~~
命令选项[options]
- --force-recreate 重新创建容器，即使配置和镜像没有改变，不兼容--no-recreate参数。
- --no-recreate 如果容器已经存在则无需重新创建，不兼容--force-recreate参数。
- --no-build 不创建镜像即使缺失
- --build 创建容器前生成镜像
### docker-compose exec
进入容器命令
~~~
docker-compose exec [options] SERVICE COMMAND [ARGS...]
eg: docker-compose exec --index=1 tomcat /bin/bash
~~~
命令选项[options]
- -d 分离模式，以后台守护进程运行命令。
- --privileged 获取特权
- -T 禁用分配TTY，默认docker-compose exec分配TTY。
- --index=index 当一个服务拥有多个容器时可通过该参数登录到该服务下的任何容器
### docker-compose run
针对服务运行一次性命令
~~~
docker-compose run [options] [-v VOLUME...] [-p PORT...] [-e KEY=VAL...] SERVICE [COMMAND] [ARGS...]
#启动web服务并bash作为其命令运行
eg: docker-compose run web bash 
~~~
命令选项[options]
- -d 指定在后台以守护进程方式运行服务容器，不占用主进程
- --name NAME 给容器指定名字
- --entrypoint CMD 重写镜像的entrypoint命令
- -e KEY=VAL 设置能被多次使用的环境变量
- -l, --label KEY=VAL 添加标签
- --no-deps 设置不启动服务所链接的容器
- --rm 运行后删除容器. detached模式会忽略
- -p, 将容器的端口发布到主机
- --service-ports 在启用服务端口并映射到主机的情况下运行命令
- --use-aliases 在容器连接到的网络中使用服务的网络别名。
- -v, --volume=[] 绑定装载卷（默认值[]）
- -T 禁用分配TTY，默认docker-compose exec分配TTY。
- -w, --workdir="" 容器内的工作目录
### docker-compose up
启动所有服务，会一次性完成 build 和 create 以及run命令的三个操作。
~~~
docker-compose up [options] [--scale SERVICE=NUM...] [SERVICE...]
~~~
命令选项[options]
- -d 指定在后台以守护进程方式运行服务容器，不占用主进程
- -no-color 设置不使用颜色来区分不同的服务器的控制输出
- -no-deps 设置不启动服务所链接的容器
- -force-recreate 设置强制重新创建容器，不能与--no-recreate选项同时使用。
- --no-create 若容器已经存在则不再重新创建，不能与--force-recreate选项同时使用。
- --no-build 设置不自动构建缺失的服务镜像
- --build 设置在启动容器前构建服务镜像
- --abort-on-container-exit 若任何一个容器被停止则停止所有容器，不能与选项-d同时使用。
- -t, --timeout TIMEOUT 设置停止容器时的超时秒数，默认为10秒。
- --remove-orphans 设置删除服务中没有在compose文件中定义的容器
- --scale SERVICE=NUM 设置服务运行容器的个数，此选项将会负载在compose中通过scale指定的参数。
### docker-compose ps
列出当前的所有容器，需要注意的是必须在docker-compose.yml文件所在的目录下执行该命令
~~~
docker-compose ps [options] [SERVICE...]
~~~
### docker-compose down
停止和删除容器、网络、卷、镜像
~~~
docker-compose down [options] [SERVICE...]
~~~
命令选项[options]
- --rmi type
    - -rmi all 删除compose文件中定义的所有镜像
    - --rmi local 删除镜像名为空的镜像
- -v, --volumes 删除已经在compose文件中定义的和匿名的附在容器上的数据卷
- --remove-orphans 删除服务中没有在compose中定义的容器
### docker-compose restart
重启服务
~~~
docker-compose restart [options] [SERVICE...]
~~~
命令选项[options]
- -t, --timeout TIMEOUT指定重启前停止容器的超时时长，默认为10秒
### docker-compose rm
删除所有停止状态的容器，推荐先执行docker-compose stop命令来停止容器。
~~~
ocker-compose rm [options] [SERVICE...]
~~~
命令选项[options]
- -f, --force 强制直接删除包含非停止状态的容器
- -v 删除容器所挂载的数据卷
### docker-compose start
启动已经存在的容器
~~~
docker-compose start [SERVICE...]
~~~
### docker-compose stop
停止已运行的服务
~~~
docker-compose stop [options] [SERVICE...]
~~~
### docker-compose logs
查看容器的日志
~~~
docker-compose logs [options] [SERVICE...]
~~~
### docker-compose pause
暂停一个服务容器
### docker-compose unpause
恢复处于暂停状态中的服务
### docker-compose kill
发送SIGKILL信号来强制停止服务容器，支持通过-s参数来指定发送的信号。
### docker-compose config
验证并查看compose文件配置
~~~
docker-compose config [options]
~~~
命令选项[options]
- --resolve-image-digests 将镜像标签标记为摘要
- -q, --quiet 只验证配置不输出，当配置正确时不输出任何容器，当配置错误时输出错误信息。
- --services 打印服务名称，一行显示一个。
- --volumes 打印数据卷名称，一行显示一个。
### docker-compose port
显示某个容器端口所映射的公共端口
~~~
docker-compose port [options] SERVICE PRIVATE_PORT
~~~
命令选项[options]
- --protocol=proto 指定端口协议，默认为TCP，可选UDP。
- --index=index 若同一个服务存在多个容器，指定命令对象容器的索引序号，默认为1
### docker-compose push
推送镜像到仓库
~~~
docker-compose push [options] [SERVICE...]
~~~
命令选项[options]
- --ignore-push-failure 忽略推送镜像过程中的错误
### docker-compose version
Docker Compose版本信息

## Docker五种网络模式与应用场景
bridge（默认）、host 、container 、none 和⾃定义（Macvlan）五种模式。
~~~yml
#指定容器的网络模式为host模式，与主机共享端口和ip，这样会占用宿主机的端口，宿主机的端口只能被这一个容器共享
network_mode: "host"
~~~
### bridge模式
bridge模式是docker的默认⽹络模式 ，当Docker进程启动时，会在主机上创建⼀个名为docker0的虚拟⽹桥，此主机上启动的Docker容器会连接到这个虚拟⽹桥上。
虚拟⽹桥的工作方式和物理交换机类似，这样主机上的所有容器就通过交换机连在了⼀个⼆层⽹络中。
从docker0⼦⽹中分配⼀个IP给容器使⽤，并设置docker0的IP地址为容器的默认⽹关。
bridge模式是docker的默认⽹络模式，不写–network参数的话就是bridge模式，可以通过 -P 或 -p 参数来指定端⼝映射。
~~~shell
docker run --name tomcat -d -p 8088:8080 tomcat
~~~
特点：
隔离性好，会占⽤宿主机端⼝，只占⽤⼀个真实IP，适⽤于⼤多数场景
### host模式
使用host模式启动容器，该容器不会获得独立的Network Namespace，而是和宿主机共同使用一个Network Namespace，不会虚拟自己的网卡，配置自己的ip等，
而是使用宿主机的ip和端口，也就是会占用宿主机的端口。
~~~shell
docker run --name mytomcat --network=host -d tomcat
# tomcat容器默认使用的是8080端口，使用host模式，tomcat容器占用了主机的端口
curl http://localhost:8080
~~~
特点：隔离性最差，只占⽤⼀个真实IP，会占⽤宿主机端⼝，会出现端⼝冲突，性能最好。能确认所有容器端⼝不冲突且默认都需要对外暴露时使⽤。
### container模式
这个模式指定新创建的容器和已经存在的⼀个容器共享⼀个Network Namespace，⽽不是和宿主机共享
新创建的容器不会创建⾃⼰的⽹卡和配置⾃⼰的IP，⽽是和⼀个指定的容器共享IP、端⼝范围等。 同样，两个容器除了⽹络⽅⾯，其他的如⽂件系统、进程列表等
还是隔离的。两个容器的进程可以通过 IO⽹卡设备通信
例子: 采用nginx容器作为容器桥反射tomcat端口
~~~shell
docker run --name tomcat -d -p 80:80 tomcat
~~~
tomcat默认暴露8080端⼝，这里利⽤bridge模式绑定80端⼝，本地访问失败，因为映射的容器端口是80，然而tomcat的容器默认端口是8080，所以访问不到
将nginx通过容器模式绑定到tomcat容器，这样通过tomcat容器的80端⼝便可转发给nginx处理
~~~shell
docker run -d --name nginx --net container:tomcat nginx
~~~
特点：隔离性好，只占⽤⼀个真实IP，会占⽤容器端⼝，性能差，开发⽹关应⽤时可以考虑
### none模式
在这种模式下，Docker容器拥有自己的Network Namespace，但是并不为Docker容器进行任何网络配置。 也就是说，这个Docker容器没有⽹卡、IP、路由等
信息。需要我们自己为Docker容器添加网卡、配置IP等。
~~~shell
docker run -it --net=none web
~~~
特点：一般用的比较少，⼀切全靠⾃定义，各项特性靠自己决定。
### macvlan模式
#### Docker的Bridge模式
docker桥接模式是在单个主机上桥接运行的，无法实现多个宿主机通信，并且会占用主机的端口。
优点：兼容性好，是Docker默认的通信规则
缺点：主机端⼝占⽤严重，⽆法使⽤指定端⼝（如：80）
缺点：⽆法跨主机容器间通信
#### Macvlan是什么
Docker内置的Macvlan驱动（Windows上是 Transparent）是为此场景而生。通过为容器提供MAC和IP地址，让容器在物理⽹络上成为"⼀等公⺠"。
因为⽆须端⼝映射或者额外桥接，可以直接通过主机接⼝（或者⼦接⼝）访问容器接⼝。
但是，Macvlan的缺点是需要将主机网卡（NIC）设置为混杂模式（Promiscuous Mode），这在⼤部分公有云平台上是不允许的。所以Macvlan对于
公司内部的数据中心网络来说很棒（假设公司网络组能接受NIC设置为混杂模式），但是 Macvlan 在公有云上并不可行。 Macvlan本身是linux 
kernel模块，其功能是允许在同⼀个物理⽹卡上配置多个MAC地址，即多个interface，每个interface可以配置⾃⼰的IP。macvlan本质上是⼀种
⽹卡虚拟化技术
#### Macvlan操作步骤
##### 1.确认⽹卡名称ifconfig
##### 2.开启混杂模式
> 不要轻易在linux服务器上执行，可以使用vmware新建linux虚拟机测试
~~~shell
ip link set ens33 promisc on
ifconfig ens33 promisc
~~~
##### 3.创建Macvlan⽹络
~~~shell
-d macvlan #指定⽹络模式
--subnet=192.168.31.0/24 #设置⼦⽹掩码
~~~
~~~shell
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
~~~
##### 4.加⼊macvlan⽹络
~~~
docker run -itd --name tomcat1 --ip=192.168.31.190 --network macvlan32 tomcat
docker run -itd --name tomcat2 --ip=192.168.31.191 --network macvlan32 tomcat
~~~
优点：
- 1、独⽴IP，维护方便，不占用主机端口，使⽤容器默认端⼝
- 2、拥有稳定的IP后，容器间跨主机通信成为可能，因为⽆论是物理机、虚拟机、容器都是物理⽹络的“⼀等公⺠”，容器间通信时直接指定IP即可

缺点：
- 1、⽹络环境需要⽀持混杂模式，公有云不⽀持，不过都上公有云了，为什么不⽤直接⽤云供应商提供的容器服务呢？
- 2、部分⼤规模应⽤集群，内⽹IP地址是稀缺资源，例如阿⾥云、腾讯云，不适合使⽤Macvlan
- 3、默认容器端⼝均对外暴露，需要在内⽹构建应⽤防⽕墙/⽹关决定哪些IP的哪些端⼝允许外界访问，哪些不允许
## 容器状态
~~~
created（已创建）
restarting（重启中）
running或up（运行中）
removing（迁移中）
paused（暂停）
exited（停止）
dead（死亡）
docker ps -a命令，可以查看全部已存在的容器
~~~

