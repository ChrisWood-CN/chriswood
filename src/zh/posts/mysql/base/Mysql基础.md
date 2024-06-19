---
title: Mysql基础
date: 2022-10-01 12:55:09
categories: Mysql
tags: Mysql
---

## Mysql

常见数据库

MYSQL：开源免费的数据库，小型的数据库.已经被Oracle收购了.MySQL6.x版本也开始收费。

Oracle：收费的大型数据库，Oracle公司的产品。Oracle收购SUN公司，收购MYSQL。

DB2 ：IBM公司的数据库产品,收费的。常应用在银行系统中.

SQLServer：MicroSoft 公司收费的中型的数据库。C#、.net等语言常使用。

SyBase：已经淡出历史舞台。提供了一个非常专业数据建模的工具PowerDesigner。

SQLite：嵌入式的小型数据库，应用在手机端。

常用数据库：MYSQL，Oracle

#### SQL语句

SQL分类：

数据定义语言：简称DDL(Data Definition Language)，用来定义数据库对象：数据库，表，列等。关键
字：create，alter，drop等

数据操作语言：简称DML(Data Manipulation Language)，用来对数据库中表的记录进行更新。关键
字：insert，delete，update等

数据控制语言：简称DCL(Data Control Language)，用来定义数据库的访问权限和安全级别，及创建用
户

数据查询语言：简称DQL(Data Query Language)，用来查询数据库中表的记录。关键字：select，
from，where等

```sql
int（integer） 整数类型
bigint （long） 整数类型
double 小数类型
decimal（m,d） 指定整数位与小数位长度的小数类型
date 日期类型，格式为yyyy-MM-dd，包含年月日，不包含时分秒
datetime 日期类型，格式为 YYYY-MM-DD HH:MM:SS，包含年月日时分秒
timestamp 日期类型，时间戳
varchar（M） 文本类型， M为0~65535之间的整数
json 8.0以上版本支持json数据类型
```

##### DDL操作语言(3%)

数据库操作：database

```mysql
#创建数据库
create database 数据库名;
create database 数据库名 character set 字符集;
#查看所有数据库
show databases;
#查看某个数据库的定义的信息
show create database 数据库名;
#删除数据库
drop database 数据库名;
#查看正在使用的数据库
select database();
#切换数据库
use 数据库名;
```

表操作：table

```mysql
#创建表
create table 表名(
字段名 类型(长度) [约束],##[ ]代表可以省略
字段名 类型(长度) [约束],
/*约束 对某列数据进行限制
主键约束--限制某列数据既不能为空也不能重复
唯一约束--限制某列数据不能重复
非空约束--限制某列数据不能为空
*/
...
字段名 类型(长度) [约束]
);
CREATE TABLE category (
cid INT primary key, #分类ID
cname VARCHAR(100) #分类名称
);
#查看数据库中的所有表
show tables;
#查看表结构
desc 表名;
#删除表
drop table 表名;
#修改表结构格式
/*添加列*/  alter table 表名 add 列名 类型(长度) [约束];
/*修改列的类型长度及约束*/  alter table 表名 modify 列名 类型(长度) 约束;
/*修改列名*/ alter table 表名 change 旧列名 新列名 类型(长度) 约束;
/*删除列*/ alter table 表名 drop 列名;#列中数据一起删除
/*修改表名*/rename table 表名 to 新表名;
/*修改表的字符集*/alter table 表名 character set 字符集(了解);
```

##### DML操作语言(7%)

```mysql
#插入表记录：insert
-- 向表中插入某些字段
insert into 表 (字段1,字段2,字段3..) values (值1,值2,值3..);
-- 向表中插入所有字段,字段的顺序为创建表时的顺序 
insert into 表 values (值1,值2,值3..);#数值类型外其他的字段类型的值必须使用引号(建议单引号)
insert into 表 values (值1,值2,值3..),(值1,值2,值3..); #批量插入
insert into 表 values [[值1,值2,值3..],[值1,值2,值3..]]; #批量插入
-- 涉及自增的可以这样用,自增数值会自动覆盖null
insert into 表 values (null,值2,值3...);
#更新表记录：update
update 表名 set 字段名=值,字段名=值,...;
update 表名 set 字段名=值,字段名=值,... where 条件;
#删除符合条件记录：delete  from 表名 [where 条件] 逐行删除,不重置主键自增,再添加数据继续用之前的主键
#删除表中所有记录: truncate table 表名  把表也删除,重新创建新表,会重置主键自增,重新开始
delete from 表名 [where 条件];
```

扩展

```mysql
show variables like 'character%'; #查看所有mysql的编码
set names gbk;#临时方案 当前窗口有效
#安装目录下修改my.ini文件，重启服务所有地方生效。
```

###### SQL约束

主键约束

```mysql
#设置主键约束
firstname int PRIMARY KEY -- 1.创建表时，在字段描述处，声明指定字段为主键
CONSTRAINT pk_personID PRIMARY KEY (firstname,lastname)
-- 2.创建表时，在constraint约束区域，声明指定字段为主键  格式： [constraint 名称] primary key (字段列表)
-- 关键字constraint可以省略，如果需要为主键命名，constraint不能省略，主键名称一般没用
-- 字段列表需要使用小括号括住，如果有多字段需要使用逗号分隔。声明两个以上字段为主键，我们称为联合主键
ALTER TABLE persons ADD PRIMARY KEY (firstname,lastname)-- 3.创建表之后，通过修改表结构，声明指定字段为主键

#删除主键约束
ALTER TABLE persons DROP PRIMARY KEY;#扩展 小bug 删除主键约束之后会保留非空约束
```

自动增长列

```mysql
/* auto_increment（自动增长列）关键字，自动增长列类型必须是整形，自动增长列必须为键(一般是主键)。*/
p_id int PRIMARY KEY AUTO_INCREMENT,
#扩展：默认AUTO_INCREMENT 的开始值是 1，如果希望修改起始值，请使用下列 SQL 语法
ALTER TABLE persons AUTO_INCREMENT=100
#删除方式：
#delete 一条一条删除，不清空auto_increment记录数。
#truncate 直接将表删除，重新建表，auto_increment将置为零，从新开始。
```

非空约束

```mysql
# NOT NULL 约束强制列不接受 NULL 值
id_p int NOT NULL,
lastname varchar(255) NOT NULL
```

唯一约束

```mysql
/*UNIQUE约束唯一标识数据库表中的每条记录.UNIQUE和PRIMARY KEY约束均为列或列集合提供了唯一性的保
证.PRIMARY KEY拥有自动定义的UNIQUE约束.!!每个表可以有多个UNIQU约束，但是每个表只能有一个PRIMARY KEY约束。*/
id_p int UNIQUE, -- 1.创建表时，在字段描述处声明唯一
CONSTRAINT 名称 UNIQUE (id_p)-- 2.创建表时，在约束区域声明唯一
ALTER TABLE persons ADD [CONSTRAINT 名称] UNIQUE (id_p)-- 3.创建表后，修改表结构，声明字段唯一
#如果值为null,则失去了unique约束的意义
#删除唯一约束
ALTER TABLE persons DROP INDEX 字段名/唯一约束名;
```

默认约束

```mysql
#方式一,创建表,列数据类型后面 default '默认值'
city varchar(20) default '北京'
#方式二,修改表结构
alter table persons modify city varchar(20) default '北京'
#删除默认约束
alter table persons modify city varchar(20)
```

###### 数据库密码重置(扩展)

1. 停止mysql服务器运行输入services.msc 停止mysql服务

2. 在cmd下,输入mysqld --console --skip-grant-tables 启动服务器,出现一下页面,不要关闭该窗口

3. 新打开cmd,输入mysql -uroot 不需要密码

   ```mysql
   use mysql;
   update user set password=password('abc') WHERE user='root';#新密码为abc
   ```

4. 关闭两个cmd窗口

#### SQL语句(DQL)

简单查询语句

```mysql
/* 格式一 查询指定的列 select 列名,列名 from 表名;
*/
SELECT pid,pname FROM product;
/* 格式二 查询所有列的数据 
 select 列出所有列名 from 表名;
 select * from 表名 //工作中很少用,查询数据多,效率慢
*/
SELECT * FROM product;
/* 格式三 过滤重复的数据 
select distinct 字段1,字段二.. from 表名;
distinct关键字之后只有一个字段,就会过滤掉这个字段中重复的数据
distinct关键字之后又多个字段,多个字段同时满足才会过滤掉
*/
-- 查询商品价格 过滤掉重复的价格
SELECT DISTINCT price FROM product;
-- 查询商品名称和价格 过滤掉名称和价格同时重复的数据
SELECT DISTINCT pname,price FROM product;
/* 格式四 别名查询 
1.给表起一个别名:多表查询时使用
	select *|字段 from 表名 [as] 别名;
2.给表中的字段起别名
	select 字段1 [as] 别名,...字段n [as] 别名 from 表名;
注意:别名只是对查询结果临时起一个名字,不会改变表中原有的名字;别名中如有特殊符号或者空格,必须用引号包裹起来
*/
SELECT * FROM product AS p;
SELECT pname AS 商品名称,price AS 商品价格 FROM product;
SELECT pname  商品名称,price  '商品 价格' FROM product;
/*
查询语句中可以直接进行数据计算
*/
SELECT (1=1+1);-- 2
-- 查询商品名称和商品价格,把价格在查询时+10000
SELECT pname  商品名称,price+10000  商品价格 FROM product;
```

条件查询

```mysql
/*
比较运算符 > < >= <= = <>(!=);between...and...显示在某一区间的值含头含尾;in(set)显示在in列表中的值;like'_a%'模糊查询,_代表一个字符%代表零个或多个任意字符;is null判断是否为空
逻辑运算符 and or not
*/
```

排序查询

```mysql
/*通过order by语句，可以将查询出的结果进行排序。暂时放置在select语句的最后。
SELECT * FROM 表名 ORDER BY 排序字段 ASC|DESC;
#ASC 升序 (默认)
#DESC 降序
*/
SELECT * FROM product ORDER BY price DESC,category_id DESC;
```

聚合查询

```mysql
/*
之前的查询都是横向查询，都是根据条件一行一行的进行判断，而使用聚合函数查询是纵向查询，它是对一列的值进行计算，然后返回一个单一的值；另外聚合函数会忽略空值。
五个聚合函数
count：统计指定列不为NULL的记录行数；
sum：计算指定列的数值和，如果指定列类型不是数值类型，那么计算结果为0；
max：计算指定列的最大值，如果指定列是字符串类型，那么使用字符串排序运算；
min：计算指定列的最小值，如果指定列是字符串类型，那么使用字符串排序运算；
avg：计算指定列的平均值，如果指定列类型不是数值类型，那么计算结果为0；
*/
SELECT count(*) FROM product
```

分组查询

```mysql
SELECT 被份组的字段1,(求和,平均值,个数,最大,最小) FROM 表名 [where 条件 ]GROUP BY 被分组字段 HAVING 分组条件;
#分组操作中的having子语句，是用于在分组后对数据进行过滤的，作用类似于where条件。
/*
having与where的区别:
having是在分组后对数据进行过滤
where是在分组前对数据进行过滤
having后面可以使用分组函数(统计函数)
where后面不可以使用分组函数
*/
```

分页查询

在工作中不是把所有满足条件的数据全部查询出来,效率低下,对数据进行分页查询,

```mysql
/*
分页查询语句 关键字 limit
格式: 
只要n条数据 select *|字段 from 表名 limit n;
select *|字段 from 表名 limit m n; m表示每页开始的行的索引(变化的) n表示每页的数量(不变的)
注意:数据库行的索引从0开始,列的索引从1开始
*/
```

#### 多表操作

###### 一对多关系

建表原则:从表使用主表的主键作为外键

```mysql
/*
外键约束的作用:保证数据的准确和完整
主表中有的数据,从表可以有也可以没有
主表中没有的数据,从表也不能有
删除主表的数据,必须保证从表没有使用
*/
#声明外键约束
alter table 从表 add [constraint][外键名称] foreign key (从表外键字段名) references 主表 (主表的主键);
#删除外键约束
alter table 从表 drop foreign key 外键名称
```

###### 多对多关系

需要创建一张中间表(商品主键--订单主键),中间表中至少两个字段，这两个字段分别作为外键指向各自一方的主键

###### 一对多操作

###### 多对多操作

#### 多表关系实战

```mysql
#实战1：省和市 
/*
省和市实例
*/
CREATE DATABASE day03;
USE day03;
-- 创建主表
CREATE TABLE province(
  pid INT PRIMARY KEY AUTO_INCREMENT,
  pname VARCHAR(20),
  description VARCHAR(50)
);
INSERT INTO province(pname,description) VALUES ('河北','雾霾'),('内蒙古','草原'),('广东','经济特区');
-- 创建从表
CREATE TABLE city(
  cid INT PRIMARY KEY AUTO_INCREMENT,
  cname VARCHAR(20),
  description VARCHAR(50),
-- 所属省份 外键
  province_pid INT
);
ALTER TABLE city ADD FOREIGN KEY (province_pid) REFERENCES province(pid);
SHOW TABLES;
INSERT INTO city VALUES (NULL,'石家庄','雾霾之最',1),(NULL,'承德','避暑山庄',1);
INSERT INTO city VALUES (NULL,'包头','草原钢城',2),(NULL,'赤峰','红山文化',2);
INSERT INTO city VALUES (NULL,'深圳','经济特区',3),(NULL,'东莞','服务行业',3);
-- 城市表添加主表省份不存在的数据
INSERT INTO city VALUES (NULL,'澳门','博彩娱乐',4);-- 报错
```

###### 自关联的一对多关系(了解)

本表的外键使用本表的主键,工作中很少用

| 地区主键 | 地区名称 | 地区描述 | 所属省份 |
| :------: | :------: | :------: | :------: |
|    1     |   河北   |   雾霾   |   null   |
|    2     |  内蒙古  |   草原   |   null   |
|    3     |  石家庄  | 雾霾之最 |    1     |
|    4     |   承德   | 避暑山庄 |    1     |
|    5     |   包头   | 草原钢城 |    2     |
|    6     |   赤峰   | 红山文化 |    2     |

```mysql
#实战2
/*
用户和角色
*/
创建用户表
创建角色表
创建中间表 添加外键(直接在创建表时声明或者alter table 从表名 add foreign key (从表字段名) references 主表(主表字段名))
```

#### 多表查询

```mysql
#交叉连接查询(很少用,有错误数据,笛卡尔积)
select * from 表A,表B
#内连接查询,在交叉连接查询的基础上,使用外键约束作为查询条件
/*隐式内连接 ,不使用关键字 [inner] join on*/
select * from 表A,表B where 表A.主键=表B.外键;
/*显式内连接 ,使用关键字 [inner] join on    on的后面可继续写where条件*/
select * from 表A  [inner] join 表B on 表A.主键=表B.外键;
#外连接,在交叉查询的基础上,使用外键约束作为查询条件
/*左外连接 ,使用关键字 left [outer] join on*/
select * from 表A  left [outer] join 表B on 表A.主键=表B.外键;
-- 左外连接查询以左边表为主,左边有的数据右边没有就使用null代替,左边没有的数据,右边也不能出现
/*右外连接 ,使用关键字 right [outer] join on*/
select * from 表A  right [outer] join 表B on 表A.主键=表B.外键;
-- 右外连接和左外连接相反

#子查询 sql语句的嵌套
/*一条sql语句的查询结果,作为另一条sql语句的查询条件*/
select * from 表B where 字段=(select 字段 from 表A [where条件])
/*一条sql语句的查询结果,作为另一条sql语句的另一张表(隐式内连接查询,先过滤数据)*/
select * from (select * from 表A [where条件]),表B where 表A.主键=表B.外键
```

#### 事务操作

事务指的是逻辑上的一组操作,组成这组操作的各个单元要么全都成功,要么全都失败
事务作用：保证在一个事务中多次SQL操作要么全都成功,要么全都失败

mysql事务操作 start transaction开启事务 commit提交事务 rollback回滚事务

#### 事务总结

###### 事务特性ACID

- 原子性(Atomicity)指事务是一个不可分割的工作单位，事务中的操作要么都发生，要么都不发生
- 一致性(Consistency)事务前后数据的完整性必须保持一致
- 隔离性(Isolation)事务的隔离性是指多个用户并发访问数据库时，一个用户的事务不能被其它用户的事务所干扰，多个并发事务之间数据要相互隔离。
- 持久性(Durability)持久性是指一个事务一旦被提交，它对数据库中数据的改变就是永久性的，接下来即使数据库发生故障也不应该对其有任何影响。

###### 并发访问问题

- 脏读：一个事务读到了另一个事务未提交的数据
- 不可重复读：一个事务读到了另一个事务已经提交(update)的数据。引发另一个事务，在事务中的多次查询结果不一致
- 虚读 /幻读：一个事务读到了另一个事务已经提交(insert)的数据。导致另一个事务，在事务中多次查询的结果不一致

###### 隔离级别(解决问题)

数据库规范规定了4种隔离级别，分别用于描述两个事务并发的所有情况

1.read uncommitted 读未提交，一个事务读到另一个事务没有提交的数据,可能存在脏读、不可重复读、虚读

2.read committed 读已提交，一个事务读到另一个事务已经提交的数据，可能存在不可重复读、虚读

3.repeatable read 可重复读，在一个事务中读到的数据始终保持一致，无论另一个事务是否提交，可能存在虚读

*serializable 串行化，同时只能执行一个事务，相当于事务中的单线程，三个问题都没有了*

安全性： serializable[8]>repeatable read[4]>read committed[2 ]>read uncommitted[1]

性能对比刚好和安全性相反

常见数据库的默认隔离级别：MySql: repeatable read   Oracle: read committed

#### mysql统计技巧

~~~sql
-- 统计前六个月的数据
SELECT month_table.monthValue as month, temp.countValue as count FROM
(SELECT
	date_format( @lastDay := last_day( date_add( @lastDay, INTERVAL 1 MONTH ) ), '%Y-%m' ) monthValue 
FROM
	( SELECT @lastDay := date_add( curdate( ), INTERVAL - 6 MONTH ) FROM mysql.help_topic LIMIT 6 ) a) month_table
LEFT JOIN
(select DATE_FORMAT(u.create_time,'%Y-%m') as monthValue, count(*) as countValue from sys_user u GROUP BY DATE_FORMAT(u.create_time,'%Y-%m')) temp ON temp.monthValue = month_table.monthValue
ORDER BY month_table.monthValue
-- 原理 1 制作前六个月的月份表
SELECT
	date_format( @lastDay := last_day( date_add( @lastDay, INTERVAL 1 MONTH ) ), '%Y-%m' ) monthValue 
FROM
	( SELECT @lastDay := date_add( curdate( ), INTERVAL - 6 MONTH ) FROM mysql.help_topic LIMIT 6 ) a
-- 原理 2 制作目标表的按月分组的统计数据
select DATE_FORMAT(u.create_time,'%Y-%m') as monthValue, count(*) as countValue from sys_user u GROUP BY DATE_FORMAT(u.create_time,'%Y-%m')
-- 使用外链接合并两张临时表，并查询出需要的字段
~~~

~~~sql
-- 统计近30天的数据
-- 1 生成30天的表
SELECT
		@s := @s + 1 AS indexs,
		DATE_FORMAT( DATE( DATE_SUB( CURRENT_DATE, INTERVAL @s DAY ) ), '%Y-%m-%d' ) AS dates 
	FROM
		mysql.help_topic,
		( SELECT @s := -1 ) temp  #不想包含当天，@s:=0
	WHERE
		@s < 30 
	ORDER BY
		dates
-- 制作目标表按天的统计数据
-- 使用外链接合并两张临时表，并查询出需要的字段
~~~

#### MySQL日期格式化

~~~
MySQL日期格式化DATE_FORMAT()取值范围。
值     含义
%S、%s 秒        两位数字形式的秒（ 00,01, ..., 59）
%I、%i 分       两位数字形式的分（ 00,01, ..., 59）
%H    小时     24小时制，两位数形式小时（00,01, ...,23）
%h    12小时制，两位数形式小时（00,01, ...,12）
%k    24小时制，数形式小时（0,1, ...,23）
%l    12小时制，数形式小时（0,1, ...,12）
%T    24小时制，时间形式（HH:mm:ss）
%r    12小时制，时间形式（hh:mm:ss AM 或 PM）
%p    AM上午或PM下午 
%W    周      一周中每一天的名称（Sunday,Monday, ...,Saturday）
%a    一周中每一天名称的缩写（Sun,Mon, ...,Sat） 
%w     以数字形式标识周（0=Sunday,1=Monday, ...,6=Saturday） 
%U    数字表示周数，星期天为周中第一天
%u    数字表示周数，星期一为周中第一天
%d     天     两位数字表示月中天数（01,02, ...,31）
%e      数字表示月中天数（1,2, ...,31）
%D    英文后缀表示月中天数（1st,2nd,3rd ...） 
%j    以三位数字表示年中天数（001,002, ...,366） 
%M     月  英文月名（January,February, ...,December） 
%b     英文缩写月名（Jan,Feb, ...,Dec） 
%m     两位数字表示月份（01,02, ...,12）
%c     数字表示月份（1,2, ...,12） 
%Y    年     四位数字表示的年份（2015,2016...）
%y      两位数字表示的年份（15,16...）
%文字   文字输出       直接输出文字内容
~~~

