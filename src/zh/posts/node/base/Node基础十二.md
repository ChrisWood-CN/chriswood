---
title: Node基础十二
date: 2022-10-01 12:32:50
categories: Node
tags: Node Node基础系列
pre: Node基础十一
---

##  十二.数据库MySQL

## 认识数据库

### 1.1. 为什么要使用数据库

任何的软件系统都需要存放大量的数据，这些数据通常是非常复杂和庞大的：

- 比如用户信息包括姓名、年龄、性别、地址、身份证号、出生日期等等；
- 比如商品信息包括商品的名称、描述、价格（原价）、分类标签、商品图片等等；
- 比如歌曲信息包括歌曲的名称、歌手、专辑、歌曲时长、歌词信息、封面图片等等；

那么这些信息不能直接存储到文件中吗？可以，但是文件系统有很多的缺点：

- 很难以合适的方式组织数据（多张表之前的关系合理组织）；
- 并且对数据进行增删改查中的复杂操作（虽然一些简单确实可以），并且保证单操作的原子性；
- 很难进行数据共享，比如一个数据库需要为多个程序服务，如何进行很好的数据共享；
- 需要考虑如何进行数据的高效备份、迁移、恢复；
- 等等...

数据库通俗来讲就是一个存储数据的仓库，数据库本质上就是一个软件、一个程序。

### 1.2. 常见的数据库有哪些？

通常我们将数据划分成两类：

- 关系型数据库：MySQL、Oracle、DB2、SQL Server、Postgre SQL等；

- - 关系型数据库通常我们会创建很多个二维数据表；
- 数据表之间相互关联起来，形成一对一、一对多、多对对等关系；
- 之后可以利用SQL语句在多张表中查询我们所需的数据；
- 支持事物，对数据的访问更加的安全；

- 非关系型数据库：MongoDB、Redis、Memcached、HBse等；

- - 非关系型数据库的英文其实是Not only SQL，也简称为NoSQL；
- 相当而已非关系型数据库比较简单一些，存储数据也会更加自由（甚至我们可以直接将一个复杂的json对象直接塞入到数据库中）；
- NoSQL是基于Key-Value的对应关系，并且查询的过程中不需要经过SQL解析，所以性能更高；
- NoSQL通常不支持事物，需要在自己的程序中来保证一些原子性的操作；

如何在开发中选择他们呢？具体的选择会根据不同的项目进行综合的分析，我这里给一点点建议：

- 目前在公司进行后端开发（Node、Java、Go等），还是以关系型数据库为主；
- 比较常用的用到非关系型数据库的，在爬取大量的数据进行存储时，会比较常见；

我们的课程是开发自己的后端项目，所以我们以关系型数据库MySQL作为主要内容。

MySQL的介绍：

- MySQL原本是一个开源的数据库，原开发者为瑞典的MySQL AB公司；
- 在2008年被Sun公司收购；在2009年，Sun被Oracle收购；
- 所以目前MySQL归属于Oracle；

MySQL是一个关系型数据库，其实本质上就是一款软件、一个程序：

- 这个程序中管理着多个数据库；
- 每个数据库中可以有多张表；
- 每个表中可以有多条数据；

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)关系型数据库

### 1.3. MySQL的下载和安装

**第一步：下载MySQL软件**

下载地址：https://dev.mysql.com/downloads/mysql/

- 根据自己的操作系统下载即可；

- 推荐大家直接下载安装版本，在安装过程中会配置一些环境变量；

- - Windows推荐下载MSI的版本；
- Mac推荐下载DMG的版本；

- 这里我安装的是MySQL最新的版本：8.0.22（不再使用旧的MySQL5.x的版本）

Windows：

- 下载下面的，不需要联网安装；

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62FK0yMcWgEBjqqcvNQE5dXHvHJ2Irqsics0HJLU1QHsIdtic2q87jicGIw/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)Windows下载的版本

Mac：

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62icJylNSAM4bk5mZwvSBouI8ymB3xCjQI2OdeE8HPVkAhArR3hIwibc7A/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)Mac下载的版本

**第二步：安装的过程**

安装的过程，基本没有太复杂的操作。

有一个需要着重说明的是MySQL8，可以采用一种更新的、安全性更高的密码和加密方式：

- 最新的加密方式有可能会被一些比较老的软件驱动不支持；
- 所以要根据情况来选择，但是我这里选择最新的加密方式了；

Windows的安装过程：

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)Server Only

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)执行

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62CRsYribbzFicIFszSG6EWIJiaiayqDpFkbSyXZbuJUlCQe22MK6oOLXarg/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)安装一个依赖

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62z39u8qonz5WsGdiaqCQWOf9Y3svcK3ysuzGQz2CUJbdrcoSAZKBKKzw/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)下一步

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62k70qPjhYoV4dibEO1AxRRO4qNq9HiavCaTqaCLtHOcdJ3zbbnPEUibCEg/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)配置端口号

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)选择密码加密方式

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)填写一个复杂的密码

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62IWLbUU0kLq8ibkEUHSBFSic3c0eTvDvibq6dZoATVQZzohwPlGozUTuKw/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)配置服务的名称

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62IvjRm4cLgZbjg3WicrX1DgwMZqDibXjrjpnJA2rrBZ7Uva1ASmrzIm3A/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)应用所有配置

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62fia8L5CT6VjzDPiaRMicezlibbuv0ycFiaIK0egfGXI8iccicPEIbQw1oau3Q/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)完成即可

**第三步：启动mysql**

在Windows启动MySQL：

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict622uZ9FyrnvFxMAPrYKJ0AhZtdIIHwHJ8EYyoIVFqDCrzVO9hwjqCoMw/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)image-20201109171443817

在Mac中启动MySQL是在系统偏好设置中：

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)Mac启动MySQL

### 1.4. mysql的连接和操作

打开终端，查看MySQL的安装：

- 这里会显示找不到命令；

```
mysql --version
```

在Windows上配置环境变量：

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62OrAGbqEib5b6dicGia0rdC6KRFWSTgiciaLIoHXJJIzlxRr82ACWib0KntjA/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)Windows上配置环境变量

在Mac上配置环境变量：

手动执行下面的终端命令，将MySQL配置到环境变量中：

```
# 添加环境变量
export PATH=$PATH:/usr/local/mysql/bin
# 再次执行mysql版本
mysql --version
```

#### 1.4.1. 终端连接数据库

我们如果想要操作数据，需要先和数据建立一个连接，最直接的方式就是通过终端来连接；

有两种方式来连接：

- 两种方式的区别在于输入密码是直接输入，还是另起一行以密文的形式输入；

```
# 方式一：
mysql -uroot -pCoderwhy888.
# 方式二：
mysql -uroot -p
Enter password: your password
```

输入成功后，会进入到mysql的REPL（交互式的编程环境）：

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62JnpyIGr4tx2hay6FP42FClFbpuWbG8UI6Og3s3wS2ouVa0u0YGAtkg/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)MySQL的REPL

我们可以直接在REPL中对数据库进行操作。

#### 1.4.2. 终端操作数据库

我们说过，一个数据库软件中，可以包含很多个数据库：

- infomation_schema：信息数据库，其中包括MySQL在维护的其他数据库、表、列、访问权限等信息；
- performance_schema：性能数据库，记录着MySQL Server数据库引擎在运行过程中的一些资源消耗相关的信息；
- mysql：用于存储数据库管理者的用户信息、权限信息以及一些日志信息等；
- sys：相当于是一个简易版的performance_schema，将数据汇总成更容易理解的形式；

注意：这里我只是在终端简单演练数据库，并没有详细讲解每一个命令，也没有完全按照SQL格式规范；

- 这些在后面会详细讲解的；

查看所有的数据库：

```
show databases;
```

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)image-20201108165132702

在终端直接创建一个属于自己的新的数据库coderhub（一般情况下一个新的项目会对应一个新的数据库）。

```
create database coderhub;
```

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)创建一个数据库

使用我们创建的数据库coderhub：

```
use coderhub;
```

在数据库中创建自己的表：

```
create table user(
	name varchar(20),
	age int,
	height double
);
```

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62EVFibib0GWnial4mhuOACqkFyAX2thes0m5s8g0rrBy2QuOSdUN7ibWG7g/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)创建用户表

在user表中插入自己的数据：

```
insert into user (name, age, height) values ('why', 18, 1.88);
insert into user (name, age, height) values ('kobe', 40, 1.98);
```

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62NLDWPzECzABc5ZlhoTic2awy2GSPGBMocgIpadOZWa6l9kGnbTnZCMQ/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)插入两条数据

查看user表中所有的数据：

```
select * from user;
```

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62HJmcEAdvA6FpMWTQER7PUkowJnlaYdmhYYZHic6I5XuhMWgHgVh2q7w/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)查询表中的数据

### 1.5. GUI工具操作数据库

我们会发现在终端操作数据库有很多不方便的地方：

- 语句写出来没有高亮，并且不会有任何的提示；
- 复杂的语句分成多行，格式看起来并不美观，很冗余出现错误；
- 终端中查看所有的数据库或者表非常的不直观和不方便；
- 等等...

所以在开发中，我们可以借助于一些GUI工具来帮助我们连接上数据库，之后直接在GUI工具中操作就会非常方便。

常见的MySQL的GUI工具有很多，这里推荐几款：

- Navicat：个人最喜欢的一款工作，但是是收费的（有免费的试用时间，或者各显神通）；
- SQLYog：一款免费的SQL工具；
- TablePlus：常用功能都可以使用，但是会多一些限制（比如只能开两个标签页）；

这里我选择使用Navicat。

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)连接数据库

查看所有的数据库、表、表中的数据：

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62MRWvtduj4pC1Yt9GvW8JSqmpWzFJJENfoHq4yicxUEz5uELrmTFjMnw/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)Navicat界面

编写SQL语句，并且执行；

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62fViaNPicV44h5ictF9vpLbP0zHic620OjEibibNXnIgKMm5EAaqwg17GKZTQ/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)Navicat编写SQL

## SQL语句

### 2.1. 认识SQL语句

我们希望操作数据库（特别是在程序中），就需要有和数据库沟通的语言，这个语言就是SQL：

- SQL是Structured Query Language，称之为结构化查询语言，简称SQL；
- 使用SQL编写出来的语句，就称之为SQL语句；
- SQL语句可以用于对数据库进行操作；

事实上，常见的关系型数据库SQL语句都是比较相似的，所以你学会了MySQL中的SQL语句，之后去操作比如Oracle或者其他关系型数据库，也是非常方便的。

SQL语句的常用规范：

- 通常关键字是大写的，比如CREATE、TABLE、SHOW等等；
- 一条语句结束后，需要以 `;` 结尾；
- 如果遇到关键字作为表明或者字段名称，可以使用``包裹;

常见的SQL语句我们可以分成四类：

- DDL（Data Definition Language）：数据定义语言；

- - 可以通过DDL语句对数据库或者表进行：创建、删除、修改等操作；

- DML（Data Manipulation Language）：数据操作语言；

- - 可以通过DML语句对表进行：添加、删除、修改等操作；

- DQL（Data Query Language）：数据查询语言；

- - 可以通过DQL从数据库中查询记录；（重点）

- DCL（Data Control Language）：数据控制语言；

- - 对数据库、表格的权限进行相关访问控制操作；

接下来我们对他们进行一个个的学习和掌握。

### 2.2. DDL语句

#### 2.2.1. 数据库的操作

**查看当前的数据库：**

```
# 查看所有的数据SHOW DATABASES;# 使用某一个数据USE coderhub;# 查看当前正在使用的数据库SELECT DATABASE();
```

**创建新的数据：**

```
# 创建数据库语句CREATE DATABASE bilibili;CREATE DATABASE IF NOT EXISTS bilibili;CREATE DATABASE IF NOT EXISTS bilibili DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```

创建数据库时，可以设置字符串和字符排序（我们可以直接使用默认的）：

- 字符集：utf8mb4在我们需要插入emoji表情时要用到；
- 排序规则：ai表示不区分重音；ci表示不区分大小写；

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)image-20201108210407214

**删除数据库：**

```
# 删除数据库DROP DATABASE bilibili;DROP DATABASE IF EXIT bilibili;
```

**修改数据库：**

```
# 修改数据库的字符集和排序规则ALTER DATABASE bilibili CHARACTER SET = utf8 COLLATE = utf8_unicode_ci;
```

#### 2.2.2. 数据表的操作

**查看数据表**

```
# 查看所有的数据表SHOW TABLES;# 查看某一个表结构DESC user;
```

**创建数据表**

```
CREATE TABLE IF NOT EXISTS `users`(	name VARCHAR(20),	age INT,	height DOUBLE);
```

### 2.3. 创建表细节

#### 2.3.1. SQL数据类型

我们知道不同的数据会划分为不同的数据类型，在数据库中也是一样：

- MySQL支持的数据类型有：数字类型，日期和时间类型，字符串（字符和字节）类型，空间类型和 JSON数据类型。

**数字类型**

MySQL的数字类型有很多：

- 整数数字类型：INTEGER，INT，SMALLINT，TINYINT，MEDIUMINT，BIGINT；

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict621PETJZSaJgOBXKPezvLSOpynauDDn3wRookibBicQwsAQmJeIwkyY16w/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)整数类型

- 精确数字类型：DECIMAL，NUMERIC（DECIMAL是NUMERIC的实现形式）；

```
salary DECIMAL(5,2)
```

- 浮点数字类型：FLOAT，DOUBLE

- - FLOAT是4个字节，DOUBLE是8个字节；

**日期类型**

MySQL的日期类型也很多：

- `YEAR`以*`YYYY`*格式显示值

- - 范围 `1901`到`2155`，和 `0000`。

- `DATE`类型用于具有日期部分但没有时间部分的值：

- - `DATE`以格式*`YYYY-MM-DD`*显示值 ；
- 支持的范围是 `'1000-01-01'` 到 `'9999-12-31'`；

- `DATETIME`类型用于包含日期和时间部分的值：

- - `DATETIME`以格式'*`YYYY-MM-DD hh:mm:ss`*'显示值；
- 支持的范围是`1000-01-01 00:00:00`到`9999-12-31 23:59:59`;

- `TIMESTAMP`数据类型被用于同时包含日期和时间部分的值：

- - `TIMESTAMP`以格式'*`YYYY-MM-DD hh:mm:ss`*'显示值；
- 但是它的范围是UTC的时间范围：`'1970-01-01 00:00:01'`到`'2038-01-19 03:14:07'`;

- 另外：`DATETIME`或`TIMESTAMP` 值可以包括在高达微秒（6位）精度的后小数秒一部分

- - 比如DATETIME表示的范围可以是`'1000-01-01 00:00:00.000000'`到`'9999-12-31 23:59:59.999999'`;

**字符串类型**

MySQL的字符串类型表示方式如下：

- `CHAR`类型在创建表时为固定长度，长度可以是0到255之间的任何值；

- - 在被查询时，会删除后面的空格；

- `VARCHAR`类型的值是可变长度的字符串，长度可以指定为0到65535之间的值；

- - 在被查询时，不会删除后面的空格；

- `BINARY`和`VARBINARY` 类型用于存储二进制字符串，存储的是字节字符串；

- - https://dev.mysql.com/doc/refman/8.0/en/binary-varbinary.html

- `BLOB`用于存储大的二进制类型；

- `TEXT`用于存储大的字符串类型；

#### 2.3.2. 表的约束

**主键：PRIMARY KEY**

一张表中，我们为了区分每一条记录的唯一性，必须有一个字段是永远不会重复，并且不会为空的，这个字段我们通常会将它设置为主键：

- 主键是表中唯一的索引；
- 并且必须是NOT NULL的，如果没有设置 NOT NULL，那么MySQL也会隐式的设置为NOT NULL；
- 主键也可以是多列索引，PRIMARY KEY(*`key_part`*, ...)，我们一般称之为联合主键；
- 建议：开发中主键字段应该是和业务无关的，尽量不要使用业务字段来作为主键；

**唯一：UNIQUE**

某些字段在开发中我们希望是唯一的，不会重复的，比如手机号码、身份证号码等，这个字段我们可以使用UNIQUE来约束：

- 使用UNIQUE约束的字段在表中必须是不同的；
- 对于所有引擎，`UNIQUE` 索引允许`NULL`包含的列具有多个值`NULL`。

**不能为空：NOT NULL**

某些字段我们要求用户必须插入值，不可以为空，这个时候我们可以使用 NOT NULL 来约束；

**默认值：DEFAULT**

某些字段我们希望在没有设置值时给予一个默认值，这个时候我们可以使用 DEFAULT来完成；

**自动递增：AUTO_INCREMENT**

某些字段我们希望不设置值时可以进行递增，比如用户的id，这个时候可以使用AUTO_INCREMENT来完成；

外键约束也是最常用的一种约束手段，我们再讲到多表关系时，再进行讲解；

```
# 创建表CREATE TABLE IF NOT EXISTS `users`(	id INT PRIMARY KEY AUTO_INCREMENT,	name VARCHAR(20) NOT NULL,	age INT DEFAULT 0,	telPhone VARCHAR(20) DEFAULT '' UNIQUE NOT NULL,	createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
```

**删除数据表**

```
# 删除表DROP TABLE `moment`;DROP TABLE IF EXISTS `moment`;
```

**修改数据表**

```
# 1.修改表名ALTER TABLE `moments` RENAME TO `moment`;# 2.添加一个新的列ALTER TABLE `moment` ADD `publishTime` DATETIME;ALTER TABLE `moment` ADD `updateTime` DATETIME;# 3.删除一列数据ALTER TABLE `moment` DROP `updateTime`;# 4.修改列的名称ALTER TABLE `moment` CHANGE `publishTime` `publishDate` DATE;# 5.修改列的数据类型ALTER TABLE `moment` MODIFY `id` INT;
```

### 2.3. DML语句

新建一张商品表：

```
CREATE TABLE IF NOT EXISTS `products`(	`id` INT PRIMARY KEY AUTO_INCREMENT,	`title` VARCHAR(20),	`description` VARCHAR(200),	`price` DOUBLE,	`publishTime` DATETIME);
```

#### 2.3.1. 插入数据

```
INSERT INTO `products` (`title`, `description`, `price`, `publishTime`) 								VALUES ('iPhone', 'iPhone12只要998', 998.88, '2020-10-10'); INSERT INTO `products` (`title`, `description`, `price`, `publishTime`) 								VALUES ('huawei', 'iPhoneP40只要888', 888.88, '2020-11-11');
```

#### 2.3.2. 删除数据

```
# 删除数据# 会删除表中所有的数据DELETE FROM `products`;# 会删除符合条件的数据DELETE FROM `products` WHERE `title` = 'iPhone';
```

#### 2.3.3. 修改数据

```
# 修改数据# 会修改表中所有的数据UPDATE `products`  SET `title` = 'iPhone12', `price` = 1299.88;# 会修改符合条件的数据UPDATE `products`  SET `title` = 'iPhone12', `price` = 1299.88 WHERE `title` = 'iPhone';
```

如果我们希望修改完数据后，直接可以显示最新的更新时间：

```
ALTER TABLE `products` ADD `updateTime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```

### 2.4. DQL语句

SELECT用于从一个或者多个表中检索选中的行（Record）。

```
SELECT select_expr [, select_expr]...	[FROM table_references]	[WHERE where_condition]	[ORDER expr [ASC | DESC]]	[LIMIT {[offset,] row_count | row_count OFFSET offset}]	[GROUP BY expr]	[HAVING where_condition]
```

我们先准备一张表：

```
CREATE TABLE IF NOT EXISTS `products` (	id INT PRIMARY KEY AUTO_INCREMENT,	brand VARCHAR(20),	title VARCHAR(100) NOT NULL,	price DOUBLE NOT NULL,	score DECIMAL(2,1),	voteCnt INT,	url VARCHAR(100),	pid INT);
```

我们在其中插入一些数据：

```
const mysql = require('mysql2'); const connection = mysql.createConnection({  host: 'localhost',  port: 3306,  user: 'root',  password: 'Coderwhy888.',  database: 'coderhub'});const statement = `INSERT INTO products SET ?;`const phoneJson = require('./phone.json');for (let phone of phoneJson) {  connection.query(statement, phone);}
```

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62t3HsvMnYVHy4GCDf3vJPwvOm3zxDMvbGXcNJcCp9dvgXkicArXOvoKg/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)image-20201111103013994

#### 2.4.1. 基本查询

查询所有的数据并且显示所有的字段：

```
SELECT * FROM `products`;
```

查询title、brand、price：

```
SELECT title, brand, price FROM `products`;
```

我们也可以给字段起别名：

- 别名一般在多张表或者给客户端返回对应的key时会使用到；

```
SELECT title as t, brand as b, price as p FROM `products`;
```

#### 2.4.2. 条件查询

在开发中，我们希望根据条件来筛选我们的数据，这个时候我们要使用条件查询：

- 条件查询会使用 WEHRE查询子句；

**WHERE的比较运算符**

```
# 查询价格小于1000的手机SELECT * FROM `products` WHERE price < 1000;# 查询价格大于等于2000的手机SELECT * FROM `products` WHERE price >= 2000;# 价格等于3399的手机SELECT * FROM `products` WHERE price = 3399;# 价格不等于3399的手机SELECT * FROM `products` WHERE price = 3399;# 查询华为品牌的手机SELECT * FROM `products` WHERE `brand` = '华为';
```

**WHERE的逻辑运算符**

```
# 查询品牌是华为，并且小于2000元的手机SELECT * FROM `products` WHERE `brand` = '华为' and `price` < 2000;SELECT * FROM `products` WHERE `brand` = '华为' && `price` < 2000;# 查询1000到2000的手机（不包含1000和2000）SELECT * FROM `products` WHERE price > 1000 and price < 2000;# OR: 符合一个条件即可# 查询所有的华为手机或者价格小于1000的手机SELECT * FROM `products` WHERE brand = '华为' or price < 1000;# 查询1000到2000的手机（包含1000和2000）SELECT * FROM `products` WHERE price BETWEEN 1000 and 2000;# 查看多个结果中的一个SELECT * FROM `products` WHERE brand in ('华为', '小米');
```

**WHERE的模糊查询**

模糊查询使用`LIKE`关键字，结合两个特殊的符号：

- `%`表示匹配任意个的任意字符；
- `_`表示匹配一个的任意字符；

```
# 查询所有以v开头的titleSELECT * FROM `products` WHERE title LIKE 'v%';# 查询带M的titleSELECT * FROM `products` WHERE title LIKE '%M%';# 查询带M的title必须是第三个字符SELECT * FROM `products` WHERE title LIKE '__M%';
```

#### 2.4.3. 查询排序

当我们查询到结果的时候，我们希望讲结果按照某种方式进行排序，这个时候使用的是`ORDER BY`；

`ORDER BY`有两个常用的值：

- `ASC`：升序排列；
- `DESC`：降序排列；

```
SELECT * FROM `products` WHERE brand = '华为' or price < 1000 ORDER BY price ASC;
```

#### 2.4.4. 分页偏移

当数据库中的数据非常多时，一次性查询到所有的结果进行显示是不太现实的：

- 在真实开发中，我们都会要求用户传入offset、limit或者page等字段；
- 它们的目的是让我们可以在数据库中进行分页查询；
- 它的用法有[LIMIT[offset,] row_countrow_count OFFSET offset]

```
SELECT * FROM `products` LIMIT 30 OFFSET 0;SELECT * FROM `products` LIMIT 30 OFFSET 30;SELECT * FROM `products` LIMIT 30 OFFSET 60;# 另外一种写法：offset, row_countSELECT * FROM `products` LIMIT 90, 30;
```

#### 2.4.5. 聚合函数

聚合函数表示对`值集合`进行操作的组（集合）函数。

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62L8Ye2kbuDjWjdJGVgkarUaxoNDbdrtXM6Y2RcfYUQLwbjDN5vbbdNg/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)聚合查询

我们这里学习最常用的一些聚合函数：

```
# 华为手机价格的平均值SELECT AVG(price) FROM `products` WHERE brand = '华为';# 计算所有手机的平均分SELECT AVG(score) FROM `products`;# 手机中最低和最高分数SELECT MAX(score) FROM `products`;SELECT MIN(score) FROM `products`;# 计算总投票人数SELECT SUM(voteCnt) FROM `products`;# 计算所有条目的数量SELECT COUNT(*) FROM `products`;# 华为手机的个数SELECT COUNT(*) FROM `products` WHERE brand = '华为';
```

事实上聚合函数相当于默认将所有的数据分成了一组：

- 我们前面使用avg还是max等，都是将所有的结果看成一组来计算的；
- 那么如果我们希望划分多个组：比如华为、苹果、小米等手机分别的平均价格，应该怎么来做呢？
- 这个时候我们可以使用 `GROUP BY`；

`GROUP BY`通常和聚合函数一起使用：

- 表示我们先对数据进行分组，再对每一组数据，进行聚合函数的计算；

我们现在来提一个需求：

- 根据品牌进行分组；
- 计算各个品牌中商品的个数、平均价格、最高价格、最低价格、平均评分；

```
SELECT brand, 			COUNT(*) as count, 			ROUND(AVG(price),2) as avgPrice,			MAX(price) as maxPrice,			MIN(price) as minPrice,			AVG(score) as avgScoreFROM `products` GROUP BY brand;
```

如果我们还希望筛选出平均价格在4000以下，并且平均分在7以上的品牌：

```
SELECT brand, 			COUNT(*) as count, 			ROUND(AVG(price),2) as avgPrice,			MAX(price) as maxPrice,			MIN(price) as minPrice,			AVG(score) as avgScoreFROM `products` GROUP BY brand HAVING avgPrice < 4000 and avgScore > 7;
```

### 2.5. 外键约束

#### 2.5.1. 创建多张表

假如我们的上面的商品表中，对应的品牌还需要包含其他的信息：

- 比如品牌的官网，品牌的世界排名，品牌的市值等等；

如果我们直接在商品中去体现品牌相关的信息，会存在一些问题：

- 一方面，products表中应该表示的都是商品相关的数据，应该有另外一张表来表示brand的数据；
- 另一方面，多个商品使用的品牌是一致时，会存在大量的冗余数据；

所以，我们可以将所有的批评数据，单独放到一张表中，创建一张品牌的表：

```
CREATE TABLE IF NOT EXISTS `brand`(	id INT PRIMARY KEY AUTO_INCREMENT,	name VARCHAR(20) NOT NULL,	website VARCHAR(100),	worldRank INT);
```

插入模拟的数据：

- 这里我是刻意有一些商品数据的品牌是没有添加的；
- 并且也可以添加了一些不存在的手机品牌；

```
INSERT INTO `brand` (name, website, worldRank) VALUES ('华为', 'www.huawei.com', 1);INSERT INTO `brand` (name, website, worldRank) VALUES ('小米', 'www.mi.com', 10);INSERT INTO `brand` (name, website, worldRank) VALUES ('苹果', 'www.apple.com', 5);INSERT INTO `brand` (name, website, worldRank) VALUES ('oppo', 'www.oppo.com', 15);INSERT INTO `brand` (name, website, worldRank) VALUES ('京东', 'www.jd.com', 3);INSERT INTO `brand` (name, website, worldRank) VALUES ('Google', 'www.google.com', 8);
```

#### 2.5.2. 创建外键

我们先给`products`添加一个`brand_id`字段：

将两张表联系起来，我们可以将`products`中的`brand_id`关联到`brand`中的`id`：

- 如果是创建表添加外键约束：

  ```
  FOREIGN KEY (brand_id) REFERENCES brand(id)
  ```

- 如果是表已经创建好，额外添加外键：

  ```
  ALTER TABLE `products` ADD FOREIGN KEY (brand_id) REFERENCES brand(id);
  ```

现在我们可以将`products`中的`brand_id`关联到`brand`中的`id`的值：

```
UPDATE `products` SET `brand_id` = 1 WHERE `brand` = '华为';UPDATE `products` SET `brand_id` = 4 WHERE `brand` = 'OPPO';UPDATE `products` SET `brand_id` = 3 WHERE `brand` = '苹果';UPDATE `products` SET `brand_id` = 2 WHERE `brand` = '小米';
```

#### 2.5.3. 删除和更新

我们来思考一个问题：

- 如果`products`中引用的外键被更新了或者删除了，这个时候会出现什么情况呢？

我们来进行一个更新操作：比如将华为的id更新为100

```
UPDATE `brand` SET id = 100 WHERE id = 1;
```

这个时候执行代码是报错的：

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62s4NqCyOHNHzI33dvsnSaKZmI3FeOoGvmwUpL1ric8ibYZCl8xiawqGVfg/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)不可以更新和删除，因为有一个外键引用

如果我希望可以更新呢？我们可以给更新时设置几个值：

- RESTRICT（默认属性）：当更新或删除某个记录时，会检查该记录是否有关联的外键记录，有的话会报错的，不允许更新或删除；

- NO ACTION：和RESTRICT是一致的，是在SQL标准中定义的；

- CASCADE：当更新或删除某个记录时，会检查该记录是否有关联的外键记录，有的话：

- - 更新：那么会更新对应的记录；
- 删除：那么关联的记录会被一起删除掉；

- SET NULL：当更新或删除某个记录时，会检查该记录是否有关联的外键记录，有的话，将对应的值设置为NULL；

**如果修改外键的更新时的动作呢？**

第一步：查看表结构：

```
# 执行命令SHOW CREATE TABLE `products`;# 结果如下：CREATE TABLE `products` (  `id` int NOT NULL AUTO_INCREMENT,  `brand` varchar(20) DEFAULT NULL,  `title` varchar(100) NOT NULL,  `price` double NOT NULL,  `score` decimal(2,1) DEFAULT NULL,  `voteCnt` int DEFAULT NULL,  `url` varchar(100) DEFAULT NULL,  `pid` int DEFAULT NULL,  `brand_id` int DEFAULT NULL,  PRIMARY KEY (`id`),  KEY `brand_id` (`brand_id`),  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`)) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

这个时候，我们可以知道外键的名称是`products_ibfk_1`。

第二步：删除之前的外键

```
ALTER TABLE `products` DROP FOREIGN KEY products_ibfk_1;
```

第三步：添加新的外键，并且设置新的action

```
ALTER TABLE `products` ADD FOREIGN KEY (brand_id) REFERENCES brand(id) ON UPDATE CASCADE ON DELETE CASCADE;
```

### 2.6. 多表查询

#### 2.6.1. 多表查询

如果我们希望查询到产品的同时，显示对应的品牌相关的信息，因为数据是存放在两张表中，所以这个时候就需要进行多表查询。

如果我们直接通过查询语句希望在多张表中查询到数据，这个时候是什么效果呢？

```
SELECT * FROM `products`, `brand`;
```

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)查询结果

我们会发现一共有648条数据，这个数据量是如何得到的呢？

- 第一张表的108条 * 第二张表的6条数据；
- 也就是说第一张表中每一个条数据，都会和第二张表中的每一条数据结合一次；
- 这个结果我们称之为 `笛卡尔乘积`，也称之为`直积`，表示为 X*Y；

但是事实上很多的数据是没有意义的，比如华为和苹果、小米的品牌结合起来的数据就是没有意义的，我们可不可以进行筛选呢？

- 使用where来进行筛选；
- 这个表示查询到笛卡尔乘积后的结果中，符合`products.brand_id = brand.id`条件的数据过滤出来；

```
SELECT * FROM `products`, `brand` WHERE `products`.brand_id = `brand`.id;
```

事实上我们想要的效果并不是这样的，而且表中的某些特定的数据，这个时候我们可以使用 SQL JOIN 操作：

- 左连接
- 右连接
- 内连接
- 全连接

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62ib7r5wOcXJmB58QP8ERVO3TCwV0ft7wEfHibfQ2Wvh7YKibJQdsSnXcGw/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)SQL JOIN

#### 2.6.2. 左连接

如果我们希望获取到的是左边所有的数据（以左表为主）：

- 这个时候就表示无论左边的表是否有对应的`brand_id`的值对应右边表的`id`，左边的数据都会被查询出来；
- 这个也是开发中使用最多的情况，它的完整写法是`LEFT [OUTER] JOIN`，但是OUTER可以省略的；

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62mWOib1xbOuvoQUlV8paKuIgqzyp1SnGTetngQiavKSj5DUwabkJibsWfQ/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)

```
SELECT * FROM `products` LEFT JOIN `brand` ON `products`.brand_id = `brand`.id;
```

如果我们查询的是左连接部分中，和右表无关的数据：

- 也非常简单，只需要加上一个条件即可：B表中的数据为空

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

```
SELECT * FROM `products` LEFT JOIN `brand` ON `products`.brand_id = `brand`.id WHERE brand.id IS NULL;
```

#### 2.6.3. 右连接

如果我们希望获取到的是右边所有的数据（以由表为主）：

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

- 这个时候就表示无论左边的表中的`brand_id`是否有和右边表中的`id`对应，右边的数据都会被查询出来；
- 右连接在开发中没有左连接常用，它的完整写法是`RIGHT [OUTER] JOIN`，但是OUTER可以省略的；

```
SELECT * FROM `products` RIGHT JOIN `brand` ON `products`.brand_id = `brand`.id;
```

如果我们查询的是右连接部分中，和左表无关的数据：

- 也非常简单，只需要加上一个条件即可：A表中的数据为空；

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62hAq5L2QQXPu7HZJG7oM9JAmR92pSJBsvlmKIE8D1s8DtUJLthJWoNg/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)

```
SELECT * FROM `products` RIGHT JOIN `brand` ON `products`.brand_id = `brand`.id WHERE products.id IS NULL;
```

#### 2.6.4. 内连接

事实上内连接是表示左边的表和右边的表都有对应的数据关联：

```
SELECT * FROM `products` INNER JOIN `brand` ON `products`.brand_id = `brand`.id;
```

我们会发现它和之前的下面写法是一样的效果：

```
SELECT * FROM `products`, `brand` WHERE `products`.brand_id = `brand`.id;
```

但是他们代表的含义并不相同：

- SQL语句一：内连接，代表的是在两张表连接时就会约束数据之间的关系，来决定之后查询的结果；
- SQL语句二：where条件，代表的是先计算出笛卡尔乘积，在笛卡尔乘积的数据基础之上进行where条件的筛选；

内连接在开发中偶尔也会常见使用，看自己的场景。

内连接有其他的写法：`CROSS JOIN`或者 `JOIN`都可以；

#### 2.6.5. 全连接

SQL规范中全连接是使用FULL JOIN，但是MySQL中并没有对它的支持，我们需要使用 UNION 来实现：

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict627x26F7vljAQ0icOfTINFSqFhoAAT0rQgadHCuPHPvTBmnnElCAl3rnQ/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)

```
(SELECT * FROM `products` LEFT JOIN `brand` ON `products`.brand_id = `brand`.id)UNION(SELECT * FROM `products` RIGHT JOIN `brand` ON `products`.brand_id = `brand`.id);
```

如果我们希望查询的是下面的结果：

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

```
(SELECT * FROM `products` LEFT JOIN `brand` ON `products`.brand_id = `brand`.id WHERE `brand`.id IS NULL)UNION(SELECT * FROM `products` RIGHT JOIN `brand` ON `products`.brand_id = `brand`.id WHERE `products`.id IS NULL);
```

### 2.7. 多对多关系

#### 2.7.1. 准备多张表

在开发中我们还会遇到多对多的关系：

- 比如学生可以选择多门课程，一个课程可以被多个学生选择；
- 这种情况我们应该在开发中如何处理呢？

这个时候我们通常是会建三张表来建立它们之间的关系的：

```
# 创建学生表CREATE TABLE IF NOT EXISTS `students`(	id INT PRIMARY KEY AUTO_INCREMENT,	name VARCHAR(20) NOT NULL,	age INT);# 创建课程表CREATE TABLE IF NOT EXISTS `courses`(	id INT PRIMARY KEY AUTO_INCREMENT,	name VARCHAR(20) NOT NULL,	price DOUBLE NOT NULL);
```

我们在两张表中插入一些数据：

```
INSERT INTO `students` (name, age) VALUES('why', 18);INSERT INTO `students` (name, age) VALUES('tom', 22);INSERT INTO `students` (name, age) VALUES('lilei', 25);INSERT INTO `students` (name, age) VALUES('lucy', 16);INSERT INTO `students` (name, age) VALUES('lily', 20);INSERT INTO `courses` (name, price) VALUES ('英语', 100);INSERT INTO `courses` (name, price) VALUES ('语文', 666);INSERT INTO `courses` (name, price) VALUES ('数学', 888);INSERT INTO `courses` (name, price) VALUES ('历史', 80);
```

#### 2.7.2. 创建关系表

我们需要一个关系表来记录两张表中的数据关系：

```
# 创建关系表CREATE TABLE IF NOT EXISTS `students_select_courses`(	id INT PRIMARY KEY AUTO_INCREMENT,	student_id INT NOT NULL,	course_id INT NOT NULL,	FOREIGN KEY (student_id) REFERENCES students(id) ON UPDATE CASCADE,	FOREIGN KEY (course_id) REFERENCES courses(id) ON UPDATE CASCADE);
```

我们插入一些数据：

```
# why 选修了 英文和数学INSERT INTO `students_select_courses` (student_id, course_id) VALUES (1, 1);INSERT INTO `students_select_courses` (student_id, course_id) VALUES (1, 3);# lilei选修了 语文和数学和历史INSERT INTO `students_select_courses` (student_id, course_id) VALUES (3, 2);INSERT INTO `students_select_courses` (student_id, course_id) VALUES (3, 3);INSERT INTO `students_select_courses` (student_id, course_id) VALUES (3, 4);
```

#### 2.7.3. 多表数据查询

查询多条数据：

```
# 查询所有的学生选择的所有课程SELECT 	stu.id studentId, stu.name studentName, cs.id courseId, cs.name courseName, cs.price coursePrice FROM `students` stu JOIN `students_select_courses` ssc 	ON stu.id = ssc.student_id JOIN `courses` cs 	ON ssc.course_id = cs.id; # 查询所有的选手选课情况SELECT 	stu.id studentId, stu.name studentName, cs.id courseId, cs.name courseName, cs.price coursePrice FROM `students` stu LEFT JOIN `students_select_courses` ssc 	ON stu.id = ssc.student_id LEFT JOIN `courses` cs 	ON ssc.course_id = cs.id;
```

查询单个学生的课程：

```
# why同学选择了哪些课程SELECT 	stu.id studentId, stu.name studentName, cs.id courseId, cs.name courseName, cs.price coursePrice FROM `students` stu JOIN `students_select_courses` ssc 	ON stu.id = ssc.student_id JOIN `courses` cs 	ON ssc.course_id = cs.id 	WHERE stu.id = 1; # lily同学选择了哪些课程SELECT 	stu.id studentId, stu.name studentName, cs.id courseId, cs.name courseName, cs.price coursePrice FROM `students` stu LEFT JOIN `students_select_courses` ssc 	ON stu.id = ssc.student_id LEFT JOIN `courses` cs 	ON ssc.course_id = cs.id 	WHERE stu.id = 5;
```

查询哪些学生没有选择和哪些课程没有被选择：

```
# 哪些学生是没有选课的SELECT 	stu.id studentId, stu.name studentName, cs.id courseId, cs.name courseName, cs.price coursePrice FROM `students` stuLEFT JOIN `students_select_courses` ssc	ON stu.id = ssc.student_idLEFT JOIN `courses` cs	ON ssc.course_id = cs.id	WHERE cs.id IS NULL;# 查询哪些课程没有被学生选择SELECT 	stu.id studentId, stu.name studentName, cs.id courseId, cs.name courseName, cs.price coursePrice FROM `students` stuRIGHT JOIN `students_select_courses` ssc	ON stu.id = ssc.student_idRIGHT JOIN `courses` cs	ON ssc.course_id = cs.id	WHERE stu.id IS NULL;
```

## Node操作MySQL

### 3.1.对象和数组

#### 3.1.1. 一对多 - 对象

前面我们学习的查询语句，查询到的结果通常是一张表，比如查询手机+品牌信息：

```
SELECT * FROM products LEFT JOIN brand ON products.brand_id = brand.id;
```

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvdojjKnD58NF714kccict62q9MKZf1ENmyg00mlTLh9kSnLODiaBSia8h2jPicMib9eZFmDcXibp4IJROw/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)查询结果

但是在真实开发中，实际上红色圈起来的部分应该放入到一个对象中，那么我们可以使用下面的查询方式：

- 这个时候我们要用 `JSON_OBJECT`;

```
SELECT products.id as id, products.title as title, products.price as price, products.score as score, 				JSON_OBJECT('id', brand.id, 'name', brand.name, 'rank', brand.phoneRank, 'website', brand.website) as brandFROM products LEFT JOIN brand ON products.brand_id = brand.id;
```

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)查询结果

#### 3.1.2. 多对多 - 数组

在多对多关系中，我们希望查询到的是一个数组：

- 比如一个学生的多门课程信息，应该是放到一个数组中的；
- 数组中存放的是课程信息的一个个对象；
- 这个时候我们要 `JSON_ARRAYAGG`和`JSON_OBJECT`结合来使用；

```
SELECT stu.id, stu.name, stu.age, 		   JSON_ARRAYAGG(JSON_OBJECT('id', cs.id, 'name', cs.name)) as courses FROM students stuLEFT JOIN students_select_courses ssc ON stu.id = ssc.student_idLEFT JOIN courses cs ON ssc.course_id = cs.idGROUP BY stu.id;
```

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)查询结果

### 3.2. mysql2的使用

#### 3.2.1. 认识mysql2

前面我们所有的操作都是在GUI工具中，通过执行SQL语句来获取结果的，那真实开发中肯定是通过代码来完成所有的操作的。

那么如何可以在Node的代码中执行SQL语句来，这里我们可以借助于两个库：

- mysql：最早的Node连接MySQL的数据库驱动；
- mysql2：在mysql的基础之上，进行了很多的优化、改进；

目前相对来说，我更偏向于使用mysql2，mysql2兼容mysql的API，并且提供了一些附加功能

- 更快/更好的性能；

- Prepared Statement（预编译语句）：

- - 提高性能：将创建的语句模块发送给MySQL，然后MySQL编译（解析、优化、转换）语句模块，并且存储它但是不执行，之后我们在真正执行时会给`?`提供实际的参数才会执行；就算多次执行，也只会编译一次，所以性能是更高的；
- 防止SQL注入：之后传入的值不会像模块引擎那样就编译，那么一些SQL注入的内容不会被执行；`or 1 = 1`不会被执行；

- 支持Promise，所以我们可以使用async和await语法

- 等等....

所以后续的学习中我会选择mysql2在node中操作数据。

**安装**

```
npm install mysql2
```

#### 3.2.2. mysql2基本使用

mysql2的使用过程如下：

- 第一步：创建连接（通过createConnection），并且获取连接对象；
- 第二步：执行SQL语句即可（通过query）；

```
const mysql = require('mysql2');// 创建连接const connection = mysql.createConnection({  host: 'localhost',  database: 'coderhub',  user: 'root',  password: 'Coderwhy888.'});// 执行SQL语句connection.query('SELECT title, price FROM products WHERE price > 9000;', (err, results, fields) => {  console.log(err);  console.log('----------');  console.log(results);  console.log('----------');  console.log(fields);})
```

通常我们的连接建立之后是不会轻易断开的，因为我们需要这个连接持续帮助我们查询客户端过来的请求。

但是如果我们确实希望断开连接，可以使用 `end` 方法：

```
connection.end();
```

#### 3.2.3. 预编译语句

Prepared Statement（预编译语句）：

- 提高性能：将创建的语句模块发送给MySQL，然后MySQL编译（解析、优化、转换）语句模块，并且存储它但是不执行，之后我们在真正执行时会给`?`提供实际的参数才会执行；就算多次执行，也只会编译一次，所以性能是更高的；
- 防止SQL注入：之后传入的值不会像模块引擎那样就编译，那么一些SQL注入的内容不会被执行；`or 1 = 1`不会被执行；

```
const statement = 'SELECT * FROM products WHERE price > ? and brand = ?;';connection.execute(statement, [1000, '华为'], (err, results) => {  console.log(results);});
```

强调：如果再次执行该语句，它将会从LRU（Least Recently Used） Cache中获取获取，省略了编译statement的时间来提高性能。

#### 3.2.4. 连接池

前面我们是创建了一个连接（connection），但是如果我们有多个请求的话，该连接很有可能正在被占用，那么我们是否需要每次一个请求都去创建一个新的连接呢？

- 事实上，mysql2给我们提供了连接池（connection pools）；
- 连接池可以在需要的时候自动创建连接，并且创建的连接不会被销毁，会放到连接池中，后续可以继续使用；
- 我们可以在创建连接池的时候设置LIMIT，也就是最大创建个数；

```
const mysql = require('mysql2');const pool = mysql.createPool({  host: 'localhost',  database: 'coderhub',  user: 'root',  password: 'Coderwhy888.',  connectionLimit: 10});const statement = 'SELECT * FROM products WHERE price > ? and brand = ?;';pool.execute(statement, [1000, '华为'], (err, results) => {  console.log(results);});
```

为什么Node执行JavaScript时单线程的，还需要连接池呢？

- 这是因为Node中操作数据库，本质上是通过Libuv进行了的数据库操作；
- 而在libuv中是可以有多个线程的，多个线程也是可以同时去建立连接来操作数据库的；

#### 3.2.5. promises

目前在JavaScript开发中我们更习惯Promise和await、async的方式，mysql2同样是支持的：

```
const mysql = require('mysql2');const pool = mysql.createPool({  host: 'localhost',  database: 'coderhub',  user: 'root',  password: 'Coderwhy888.',  connectionLimit: 5});const statement = 'SELECT * FROM products WHERE price > ? and brand = ?;';pool.promise().execute(statement, [1000, '华为']).then(([results]) => {  console.log(results);});
```

### 3.3. ORM的sequelize

#### 3.3.1. 认识ORM

**对象关系映射**（英语：**Object Relational Mapping**，简称**ORM**，或**O/RM**，或**O/R mapping**），是一种程序设计的方案：

- 从效果上来讲，它提供了一个可在编程语言中，使用 `虚拟对象数据库` 的效果；
- 比如在Java开发中经常使用的ORM包括：Hibernate、MyBatis；

Node当中的ORM我们通常使用的是 `sequelize`;

- Sequelize是用于Postgres，MySQL，MariaDB，SQLite和Microsoft SQL Server的基于Node.js 的 ORM；
- 它支持非常多的功能；

如果我们希望将Sequelize和MySQL一起使用，那么我们需要先安装两个东西：

- mysql2：sequelize在操作mysql时使用的是mysql2；
- sequelize：使用它来让对象映射到表中；

```
npm install sequelize mysql2
```

#### 3.3.2. Sequelize的使用

Sequelize的连接数据库：

- 第一步：创建一个Sequelize的对象，并且制定数据库、用户名、密码、数据库类型、主机地址等；
- 第二步：测试连接是否成功；

```
const {Sequelize, DataTypes, Model, Op} = require('sequelize');const sequelize = new Sequelize('coderhub', 'root', 'Coderwhy888.', {  host: 'localhost',  dialect: 'mysql'});sequelize.authenticate().then(() => {  console.log("sequelize连接成功~");}).catch(err => {  console.log("sequlize连接失败~", err);});
```

Sequelize映射关系表：

```
class Student extends Model {}Student.init({  id: {    type: DataTypes.INTEGER,    primaryKey: true,    autoIncrement: true  },  name: {    type: DataTypes.STRING,    allowNull: false  },  age: DataTypes.INTEGER}, {  sequelize,  createdAt: false,  updatedAt: false})
```

测试增删改查的操作：

```
async function queryStudent() {  // 1.查询所有的学生  const result1 = await Student.findAll({});  console.log(result1);  // 2.查询年龄大于等于20岁的学生  const result2 = await Student.findAll({    where: {      age: {        [Op.gte]: 20      }    }  });  console.log(result2);  // 3.创建用户  const result3 = await Student.create({    name: 'hmm',    age: 22  });  console.log(result3);  // 4.更新用户  const result4 = await Student.update({    age: 25  }, {    where: {      id: 6    }  });  console.log(result4);}queryStudent();
```

#### 3.3.3. 多对多关系

第一步：连接数据库

```
const { Sequelize, DataTypes, Model, Op } = require('sequelize');const sequelize = new Sequelize('coderhub', 'root', 'Coderwhy888.', {  host: 'localhost',  dialect: 'mysql'});
```

第二步：创建映射关系

```
class Student extends Model {}Student.init({  id: {    type: DataTypes.INTEGER,    primaryKey: true,    autoIncrement: true  },  name: {    type: DataTypes.STRING,    allowNull: false  },  age: DataTypes.INTEGER}, {  sequelize,  createdAt: false,  updatedAt: false})class Course extends Model {}Course.init({  id: {    type: DataTypes.INTEGER,    primaryKey: true,    autoIncrement: true  },  name: {    type: DataTypes.STRING(20),    allowNull: false  },  price: {    type: DataTypes.DOUBLE,    allowNull: false  }}, {  sequelize,  createdAt: false,  updatedAt: false});class StudentCourse extends Model {};StudentCourse.init({  id: {    type: DataTypes.INTEGER,    primaryKey: true,    autoIncrement: true  },  studentId: {    type: DataTypes.INTEGER,    references: {      model: Student,      key: 'id'    },    field: 'student_id',  },  courseId: {    type: DataTypes.INTEGER,    references: {      model: Course,      key: 'id'    },    field: 'course_id',  }}, {  sequelize,  createdAt: false,  updatedAt: false,  tableName: 'students_select_courses'});
```

第三步：建立多对多的联系

```
Student.belongsToMany(Course, {  through: StudentCourse,   foreignKey: 'student_id',   otherKey: 'course_id',});Course.belongsToMany(Student, {  through: StudentCourse,   foreignKey: 'course_id',   otherKey: 'student_id'});
```

第四步：执行多对多查询操作：

```
async function queryStudent() {  // 查询结果  const result = await Student.findAll({    include: {      model: Course    }
```

# http协议

```
1.超文本传输协议
规定了如何从网站服务器传输超文本到本地浏览器,基于客户端服务器架构工作,是客户端和服务器端请求和应答标准

2.报文   过程中传递的数据块
请求报文:1.请求方式 req.method获取请求方式   GET POST
		2.请求地址 req.url获取请求地址
		3.请求报文 req.headers['键名']获取请求报文
		
请求组成:请求行 方式 资源 协议版本
		请求头 键值对
		请求体 post有请求参数 get请求参数不在请求体中,在url地址后面
		

响应报文:1.http状态码   200成功 404没找到 500服务器端错误 400客户端请求语法错
		2.内容类型 text/html text/css application/javascript image/jpeg application/json
		3. 内容长度 内容..
		res.writeHead(状态码,{'content-type':'text/plain'}) 内容类型默认纯文本
		res.end('...')响应内容
		
响应组成:响应行 http协议 状态码 其他状态码(成功2xx 重定向 3xx 客户端4xx 服务器端错误5xx)
		响应头 键值对
		响应体 post有请求参数 get请求参数不在请求体中,在url地址后面
```

### http请求与响应处理

```
8种请求方式 OPTIONS HEAD  GET POST PUT DELETE TRACE 

请求参数GET
使用url模块,用于处理url地址   
url.parse(req.url) 返回一个对象
url.parse(req.url,true)把查询参数解析成对象
url.parse(req.url,true).query得到这个对象  通过这个对象.键名得到参数值

解构赋值 { query, pathname} = url.parse(req.url,true) 得到参数对象和请求地址
```

### window释放端口

```
1.cmd
2.netstat -ano | findstr 9090 查询端口9090使用情况
3.tasklist | findstr +进程ID  查询端口被进程占用的程序
4.taskkill /f /t /im  +进程ID或程序  杀死进程
```

# NPM

## npm常用命令

```shell
# 临时
$ npm --registry https://registry.npm.taobao.org install 插件名
# 配置
$ npm config set registry https://registry.npm.taobao.org

# 查看 npm 的版本 
$ npm -v  
# 查看各个命令的简单用法
$ npm -l 
# 查看 npm 命令列表
$ npm help
# 查看 npm 的配置
$ npm config list -l
# 查看插件的版本
npm view 插件名 versions
# 创建模块
npm init
#当前项目安装的所有模块
$npm list
#列出全局安装的模块 带上[--depth 0] 不深入到包的支点 更简洁
$ npm list -g --depth 0

# 读取package.json里面的配置单安装  
$ npm install 
//可简写成 npm i

# 默认安装指定模块的最新(@latest)版本
$ npm install [<@scope>/]<name> 
//eg:npm install gulp

# 安装指定模块的指定版本
$ npm install [<@scope>/]<name>@<version>
//eg: npm install gulp@3.9.1

# 安装指定指定版本范围内的模块
$ npm install [<@scope>/]<name>@<version range>
//eg: npm install vue@">=1.0.28 < 2.0.0"

# 安装指定模块的指定标签 默认值为(@latest)
$ npm install [<@scope>/]<name>@<tag>
//eg:npm install sax@0.1.1

# 通过Github代码库地址安装
$ npm install <tarball url>
//eg:npm install git://github.com/package/path.git

#卸载当前项目或全局模块 
$ npm uninstall <name> [-g] 

#升级当前项目或全局的指定模块
$ npm update <name> [-g]

# 引用依赖 有些包是全局安装了，在项目里面只需要引用即可。
$ npm link [<@scope>/]<pkg>[@<version>]
//eg: 引用   npm link gulp gulp-ssh gulp-ftp
//eg: 解除引用 npm unlink gulp

# 未注册 申请注册一个用户 直接在https://www.npmjs.com/注册一样
$ npm adduser
//执行后 填写几个问题 Username、Password、Email

#已注册
$ npm login 

#发布
$ npm publish
```

## NPM私库搭建

### npm+git

```
1.新建私有git仓库
2.clone仓库
3.npm init
4.按npm规范开发完。push到仓库即可
```

verdaccio(https://www.jianshu.com/p/0c905e4a8b70)

### 云服务器安装node环境,nginx

> 1 云服务器安装verdaccio(轻量级开源私有npm代理注册表)
> npm i verdaccio -g

>2 启动服务：
>verdaccio

> 3 配置config.yaml

```
1、vim /home/yg/.config/verdaccio/config.yaml 进入编辑配置文件

# This is the default config file. It allows all users to do anything,
# so don't use it on production systems.
#
# Look here for more config file examples:
# https://github.com/verdaccio/verdaccio/tree/master/conf
#

# path to a directory with all packages
# 所有包缓存的目录
storage: ./storage
# path to a directory with plugins to include
# 插件目录
plugins: ./plugins

# 开启web服务，能够通过web访问
web:
  # WebUI is enabled as default, if you want disable it, just uncomment this line
  #enable: false
  title: Verdaccio

# 验证信息
auth:
  htpasswd:
    # 用户信息存储目录
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    #max_users: 1000

# a list of other known repositories we can talk to
# 公有仓库配置
uplinks:
  npmjs:
    url: https://registry.npmjs.org/

packages:
  '@*/*':
    # scoped packages
    access: $all
    publish: $authenticated
    # 代理，表示没有的仓库去这个npmjs里边去找
    # npmjs 又指向 https://registry.npmjs.org/ ,就是上面的 uplinks 配置
    proxy: npmjs

  '**':
    # allow all users (including non-authenticated users) to read and
    # publish all packages
    #
    # you can specify usernames/groupnames (depending on your auth plugin)
    # and three keywords: "$all", "$anonymous", "$authenticated"
    # 三种身份所有人，匿名用户，认证（登录用户）
    # 是否可访问所需的权限
    access: $all

    # allow all known users to publish packages
    # (anyone can register by default, remember?)
    # 发布package的权限
    publish: $authenticated

    # if package is not available locally, proxy requests to 'npmjs' registry
    # 如果package不存在，就向代理的上游服务器发起请求
    proxy: npmjs

# To use `npm audit` uncomment the following section
middlewares:
  audit:
    enabled: true

# 监听端口，重点，不配置这个只能本机可以访问
listen: 0.0.0.0:4873

# log settings
logs:
  - {type: stdout, format: pretty, level: http}
  #- {type: file, path: verdaccio.log, level: info}
```

> 4.启动  pm2 start verdaccio   这是后就可以通过http://xxx（ip地址）去访问了

> 5.如何使用

```
#当前npm 服务指向本地 
npm set registry http://localhost:4873
# 注册用户 在本地注册一个用户然后指向我们的地址然后我们就可以发布包了
npm adduser --registry http://xxx:4873
Username: xxx
Password: xxx
Password:  xxx
Email: (this IS public) xxx
Logged in as yg-ui on http://xxx/ （你的ip地址）这时候我们就注册一个用户，我们可以用这个用户名和密码去登录去上图窗口去登录
```

- ###### 与私服连接

```
npm set registry http://xxx：4873 (失败试试：npm config set registry http://xxx:4873 ，然后查看是否配置成功npm config edit）
把下载镜像源的地址切换到从我们的服务器上下载。这里的npmrc文件里面内地址也就会易主
```

- ###### 安装nrm

```
nrm是 npm registry 管理工具, 能够查看和切换当前使用的registry。不安装也可以，安装会更高效。
1、安装 npm install -g nrm
2、添加私服地址到nrm管理工具

3、这里的 yg-ui是我们给自己的私服地址起的别名，为了切换和使用方便。
   nrm add yg-ui http://xxx:4873 成功后如下
     add registry my50 success
4、将npm包的下载地址改到my50的私服。
   nrm use yg-ui 成功后如下
     verb config Skipping project config: /home/yg/.npmrc.
     Registry has been set to: http://xxx:4873/
5、使用nrm ls可查到我们可以使用的所有镜像源地址，* 后面是当前使用的，如果我们不想从私服上下载包，就可以用上一步骤的nrm use命令，use其它的地址，将下载地址改到别的服务器。
   
   输入 nrm ls 成功后如下
   npm ---- https://registry.npmjs.org/
   cnpm --- http://r.cnpmjs.org/
   taobao - https://registry.npm.taobao.org/
   nj ----- https://registry.nodejitsu.com/
   rednpm - http://registry.mirror.cqupt.edu.cn/
   npmMirror  https://skimdb.npmjs.com/registry/
   edunpm - http://registry.enpmjs.org/ 
   * yg-ui --- http://xxx:4873/

   其实nrm只是个npm registry 管理工具，有了它可以让我们切换和查看registry 地址更方便快捷，即便没有它，我们直接用npm的set命令也可以切换地址，用type命令也可以查看地址，只不过用nrm更便捷，用不用随你了，觉得方便就用。
```

- ###### 发布包

```
1、新建一个npmtest 目录，里边放一个文件
2、进入目录 npm init 生成package.json
3、npm publish           # 第二次发包已经切换到我们私服地址的情况下
   npm publish --registry http://xxx:4873   #未切换到我们的私服时，直接加后缀可以发布到私服上。
  第二次发包我们需要npm login 输入用户密码以及邮箱即可（这里需要注意的是
```

- ###### 下载包

```
1、新建.npmrc文件
   registry=http://xxx:4873/#/detail/ui-test
   //xxx/:_authToken="EF+Q227aTInBu2cvmkDyiozkm/Z/nOz9m1mWK/PlgoA="
   //localhost:4873/:_authToken="OTmT9IjKXStdvRwV8RRf6g=="
   package-lock=false
   npm config edit  可以查看到_authToken
2、npm install npmtest --save

   这个命令是默认下载当前定位文件夹下package.json文件中需要的所有包，包括其间接依赖的包。第一次下载

   之后的包都会缓存在我们的私服上，然后后期下载的时候从私服下载，就不会再从npmjs上下载包，但是它下

   载每个包的时候都会再走一遍npmjs去检查包的版本，即便不下载资源，但这无疑也浪费了时间。经验证发

   现，我们的package-lock.json文件在此刻起了大作用，因为package-lock.json文件本来就是更新node库后自

   动生成的文件，里面包含了node库中所有包的下载地址当前版本以及包之间的依赖关系，既然package-

   lock.json稳定了版本，所以当我们项目中包含了这个文件时，我们下包时就会根据package-lock.json的稳定版

   本来，就不会再去npmjs上去检查了，这样会极大的提升下载包的速度。所以项目中一定要有稳定的

   package.json和package-lock.json文件，并及时更新这两个文件。
   package.json里边配置
   "publishConfig": {
     "registry": "http://xxx/repository/npmself/"
   },
```

- ###### 删除包

````
$ cd /home/yg/.config/verdaccio
$ ls 
config.yaml  htpasswd  storage
$ cd storage
$ ls
$ rm -rf  ui-test
````

