---
title: shardingsphere知识.md
categories: 
- Java
- shardingsphere
tags:
- Java
---
### Mysql架构演变升级+分库分表优缺点
#### 单机
#### 主从
- 数据库主从同步，从库可以水平扩展，满足更大读需求
- 但单服务器TPS，内存，IO都有限
#### 双主
- 写请求越来越多,一个Master是不够，添加多个主节点进行写入
- 多个主节点数据要保存一致性，写操作需要2个master之间同步,更加复杂
#### 分库和分表
A微服务-->A主节点,A从节点
B微服务-->B主节点,B从节点
### Mysql数据库分库分表后带来的优点
#### 分库分表解决的现状问题
##### 解决数据库本身瓶颈
- 连接数： 连接数过多时，就会出现‘too many connections’的错误，访问量太大或者数据库设置的最大连接数太小的原因
- Mysql默认的最大连接数为100.可以修改，而mysql服务允许的最大连接数为16384
- 数据库分表可以解决单表海量数据的查询性能问题
- 数据库分库可以解决单台数据库的并发访问压力问题
##### 解决系统本身IO、CPU瓶颈
- 磁盘读写IO瓶颈，热点数据太多，尽管使用了数据库本身缓存，但是依旧有大量IO,导致sql执行速度慢
- 网络IO瓶颈，请求的数据太多，数据传输大，网络带宽不够，链路响应时间变长
- CPU瓶颈，尤其在基础数据量大单机复杂SQL计算，SQL语句执行占用CPU使用率高，也有扫描行数大、锁冲突、锁等待等原因
    - 可以通过 show processlist; 、show full processlist，发现 CPU 使用率比较高的SQL
    - 常见的对于查询时间长，State 列值是 Sending data，Copying to tmp table，Copying to tmp table on disk，Sorting result，Using filesort 等都是可能有性能问题SQL，清楚相关影响问题的情况可以kill掉
    - 也存在执行时间短，但是CPU占用率高的SQL，通过上面命令查询不到，这个时候最好通过执行计划分析explain进行分析
### Mysql数据库分库分表后的六大问题怎么解决
#### 问题一：跨节点数据库Join关联查询
- 数据库切分前，多表关联查询，可以通过sql join进行实现
- 分库分表后，数据可能分布在不同的节点上，sql join带来的问题就比较麻烦
#### 问题二：分库操作带来的分布式事务问题
- 操作内容同时分布在不同库中，不可避免会带来跨库事务问题，即分布式事务
#### 问题三：执行的SQL排序、翻页、函数计算问题
- 分库后，数据分布再不同的节点上， 跨节点多库进行查询时，会出现limit分页、order by排序等问题
- 而且当排序字段非分片字段时，更加复杂了，要在不同的分片节点中将数据进行排序并返回，然后将不同分片返回的结果集进行汇总和再次排序（也会带来更多的CPU/IO资源损耗）
#### 问题四：数据库全局主键重复问题
- 常规表的id是使用自增id进行实现，分库分表后，由于表中数据同时存在不同数据库中，如果用自增id，则会出现冲突问题
#### 问题五：容量规划,分库分表后二次扩容问题
- 业务发展快，初次分库分表后，满足不了数据存储，导致需要多次扩容
#### 问题六：分库分表技术选型问题
- 市场分库分表中间件相对较多，框架各有各的优势与短板，应该如何选择

### 海量数据下Mysql数据库常见分库分表
#### Mysql数据库垂直分表
##### 垂直分表介绍
- “大表拆小表”，基于列字段进行
- 拆分原则一般是表中的字段较多，将不常用的或者数据较大，长度较长的拆分到“扩展表 如text类型字段
- 访问频次低、字段大的商品描述信息单独存放在一张表中，访问频次较高的商品基本信息单独放在一张表中
##### 垂直拆分原则
- 把不常用的字段单独放在一张表;
- 把text，blob等大字段拆分出来放在附表中;
- 业务经常组合查询的列放在一张表中
~~~sql
//拆分前
CREATE TABLE `product` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(524) DEFAULT NULL COMMENT '视频标题',
  `cover_img` varchar(524) DEFAULT NULL COMMENT '封面图',
  `price` int(11) DEFAULT NULL COMMENT '价格,分',
  `total` int(10) DEFAULT '0' COMMENT '总库存',
  `left_num` int(10) DEFAULT '0' COMMENT '剩余',
  
  `learn_base` text COMMENT '课前须知，学习基础',
  `learn_result` text COMMENT '达到水平',
  `summary` varchar(1026) DEFAULT NULL COMMENT '概述',  
  `detail` text COMMENT '视频商品详情',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

//拆分后
CREATE TABLE `product` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(524) DEFAULT NULL COMMENT '视频标题',
  `cover_img` varchar(524) DEFAULT NULL COMMENT '封面图',
  `price` int(11) DEFAULT NULL COMMENT '价格,分',
  `total` int(10) DEFAULT '0' COMMENT '总库存',
  `left_num` int(10) DEFAULT '0' COMMENT '剩余',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `product_detail` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(11) DEFAULT NULL COMMENT '产品主键',
  `learn_base` text COMMENT '课前须知，学习基础',
  `learn_result` text COMMENT '达到水平',
  `summary` varchar(1026) DEFAULT NULL COMMENT '概述',  
  `detail` text COMMENT '视频商品详情',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
~~~
#### Mysql数据库垂直分库
##### 垂直分库介绍
- 垂直分库针对的是一个系统中的不同业务进行拆分， 数据库的连接资源比较宝贵且单机处理能力也有限
- 没拆分之前全部都是落到单一的库上的，单库处理能力成为瓶颈，还有磁盘空间，内存，tps等限制
- 拆分之后，避免不同库竞争同一个物理机的CPU、内存、网络IO、磁盘，所以在高并发场景下，垂直分库一定程度上能够突破IO、连接数及单机硬件资源的瓶颈
- 垂直分库可以更好解决业务层面的耦合，业务清晰，且方便管理和维护
- 一般从单体项目升级改造为微服务项目，就是垂直分库
#### Mysql数据库水平分表
##### 水平分表介绍
- 都是大表拆小表 垂直分表：表结构拆分 水平分表：数据拆分
- 把一个表的数据分到一个数据库的多张表中，每个表只有这个表的部分数据
- 核心是把一个大表，分割N个小表，每个表的结构是一样的，数据不一样，全部表的数据合起来就是全部数据
- 针对数据量巨大的单张表（比如订单表），按照某种规则（RANGE,HASH取模等），切分到多张表里面去
- 但是这些表还是在同一个库中，所以单数据库操作还是有IO瓶颈，主要是解决单表数据量过大的问题
- 减少锁表时间，没分表前，如果是DDL(create/alter/add等)语句，当需 要添加一列的时候mysql会锁表，期间所有的读写操作只能等待
#### Mysql数据库水平分库
##### 水平分库介绍
- 把同个表的数据按照一定规则分到不同的数据库中，数据库在不同的服务器上
- 水平分库是把不同表拆到不同数据库中，它是对数据行的拆分，不影响表结构
- 每个库的结构都一样,但每个库的数据都不一样，没有交集，所有库的并集就是全量数据
- 水平分库的粒度，比水平分表更大

#### 总结
#####垂直角度（表结构不一样）
- 垂直分表: 将一个表字段拆分多个表，每个表存储部分字段
    - 好处: 避免IO时锁表的次数，分离热点字段和非热点字段，避免大字段IO导致性能下降
    - 原则：业务经常组合查询的字段一个表；不常用字段一个表；text、blob类型字段作为附属表
- 垂直分库：根据业务将表分类，放到不同的数据库服务器上 
    - 好处：避免表之间竞争同个物理机的资源，比如CPU/内存/硬盘/网络IO
    - 原则：根据业务相关性进行划分，领域模型，微服务划分一般就是垂直分库

##### 水平角度（表结构一样）
- 水平分库：把同个表的数据按照一定规则分到不同的数据库中，数据库在不同的服务器上
    - 好处: 多个数据库，降低了系统的IO和CPU压力
    - 原则 选择合适的分片键和分片策略，和业务场景配合;避免数据热点和访问不均衡、避免二次扩容难度大
- 水平分表：同个数据库内，把一个表的数据按照一定规则拆分到多个表中，对数据进行拆分，不影响表结构
    - 好处: 单个表的数据量少了，业务SQL执行效率高，降低了系统的IO和CPU压力
    - 原则 选择合适的分片键和分片策略，和业务场景配合;避免数据热点和访问不均衡、避免二次扩容难度大