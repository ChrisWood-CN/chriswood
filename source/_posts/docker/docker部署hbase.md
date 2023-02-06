---
title: docker部署hbase date: 2023-02-06 15:22:50 categories:

- docker
- hbase tags:
- docker
- hbase

---

## docker搭建hbase

### 环境

Linux系统：centos 7.6 Hbase：harisekhon/hbase

### Hbase

1.拉取镜像 并部署启动

~~~
方式一 手动分配所有端口
docker run -d -p 2181:2181 \
-p 8080:8080 -p 8085:8085 -p 9090:9090 -p 9095:9095 \
-p 16000:16000 -p 16010:16010 -p 16201:16201 -p 16301:16301  -p 16030:16030 -p 16020:16020 \
--name hbase harisekhon/hbase

方式二 系统自动映射端口（-P主机随机分配端口与宿主机上端口进行映射）
docker run -d --name hbase -P harisekhon/hbase

方式三 只映射web页面的端口（推荐）
docker run -d --name hbase -p 16010:16010 harisekhon/hbase

2181	zookeeper	zkCli.sh -server zookeeper1:2181	客户端接入
16000	HBase Master	hbase-client-1.x.x.jar	RegionServer接入
16010	HBase Master	http://namenode1:16010/	集群监控
16020	HBase RegionServer		客户端接入
16030	HBase RegionServer	http://datanode1:16030/	节点监控
~~~

打开网址： http://xxx.xxx.xxx.xxx:16010/master-status
2.Host文件设置 如果在本地访问 Hbase网址，还需要在HOST文件中添加Hbase与域名的映射。

~~~
xxx.xxx.xxx.xxx b0fbee058d4e
~~~

3.环境变量 实际项目在开发环境利用Java来操作Hbase所以还需要在本地配置下Hadoop环境变量。

~~~
HODOOP_HOME： D:\Environment\Hadoop\2.10.1
PATH： %HODOOP_HOME%\bin
~~~

4.hbase操作

~~~
docker exec -it hbase bash
cd hbase-2.1.3/bin
~~~

- 进入hbase客户端

~~~
./hbase shell
~~~

- 创建命名空间

~~~
create_namespace 'test'
~~~

- 查看命名空间

~~~
list_namespace
~~~

> 注：HBase系统默认定义了两个默认的 namespace hbase：系统内建表，包括 namespace 和 meta 表 default：用户建表时未指定 namespace 的表都创建在此

- 删除命名空间

~~~
drop_namespace 'test'
~~~

- 创建表

~~~
create '命名空间:表名'，{NAME => ’列族名‘, '列族属性' =>  ''}
create 'test:user', {NAME => 'aaa', VERSIONS => '3', TTL => '2147483647', 'BLOOMFILTER' => 'ROW'}, 
					{NAME => 'bbb', VERSIONS => '3', TTL => '2147483647', 'BLOOMFILTER' => 'ROW'}
# 意思是，在 test 命名空间下创建 user 表，表中有两个列族，分别是列 aaa 和 bbb，版本有3个，存活时间 2147483647(s)，布隆过滤器过滤依据是 RowKey。
~~~

- 查看表结构

~~~
desc '命名空间:表名'
~~~

- 修改列族属性

~~~
alter '命名空间:表名', NAME => '列族名', 列族属性=> 'NewValue'
~~~

- 查看命名空间下的表

~~~
list_namespace_tables '命名空间'
~~~

- 删除表

~~~
disable 'test:user' # 删除前要先禁用表
drop 'test:user' 	# 执行删除
~~~

- 扫描数据（多行）

~~~
scan '命名空间:表名'
~~~

- 添加数据

~~~
put ‘命名空间:表名’, 'RowKey', '列族:列', '具体值'

put 'test:user','1', 'aaa:name', 'zhangsan'
put 'test:user','1', 'bbb:phone', '12345678919'

put 'test:user','2', 'aaa:name', 'lisi' 
~~~

> 注：HBase 是列族式数据库，所以是在真正添加数据时才指定有哪些列

> 在建表时设置了 Version=3 ，aaa:name 可以保存三个值 put 'test:user','1', 'b:name', 'wangwu' put 'test:user','1', 'b:name', 'zhaoliu'
> 为什么添加后再 scan 看不到添加的数据呢？
> 因为 scan 扫描多行，所以显示的是所有列的最新版本；要获取一个列列数据的所有版本要通过单列查询 get…

- 获取数据（单行）

~~~
get '命名空间:表名', 'RowKey' 						 # 获取指定行键的数据
get '命名空间:表名', 'RowKey', {COLUMN => '列族:列'}    # 获取指定行键的指定列的数据
get '命名空间:表名', 'RowKey', {COLUMN => '列族:列', VERSIONS => n}   # 获取指定行键的指定列的数据，显示n个版本

get 'test:user', '1', {COLUMN => 'aaa:name', VERSIONS => 3} # 注：建表时设置的 3，即使你这写个 4，也只能返回三行数据
~~~

- 更新数据

~~~
put ‘命名空间:表名’, 'RowKey', '列族:列', 'NewValue' #更新其实就是追加（如果此时数据个数到达 Version 数了，那么前面最老的版本就会被淘汰）
~~~

- 删除数据
~~~
delete '命名空间:表名', 'RowKey', '列族:列', 时间戳（注：如果不指定时间戳，则默认删除最新版本）
~~~
> 已经有4条数据了 删除最新的一条 则之前三条会出来
> 重点：HBase 的删除只是打上了删除了标记（墓碑标记），跟更新一样，并不是真正移除，过早的版本会在执行 Major Compaction 时真正删除

- 清空表中数据
~~~
truncate` '命名空间:表名' # 三步：1.禁用 2.删除 3.重建
~~~
> 注：HBase 的脚本是.hsh，跟.sql一个意思。
