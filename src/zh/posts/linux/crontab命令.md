---
title: crontab命令
categories: Linux
tags:
  - Linux
  - crontab
date: 2023-06-20 09:58:10
---

## 简介

crontab 命令常见于 Unix 和类 Unix 的操作系统之中，用于设置周期性被执行的指令。该命令从标准输入设备读取指令，
并将其存放于“crontab”文件中（是“cron table”的简写）

## 使用

### 检查 crontab 服务

```shell
crontab -l
#显示‘no crontab for root’ 或者 当前的任务列表 或者 不报错 说明已经安装
```

#### 安装 crontab 服务

```shell
#centOS
yum -y install vixie-cron crontabs
#ubuntu
apt-get install cron
```

#### cron 服务的启动与关闭

```shell
# centOS
# 查看cond 状态
service crond status
# 启动cron
service crond start
# 关闭cron
service crond stop
# 重启cron
service crond restart

# ubuntu
# 查看cond 状态
service cron status
# 启动cron
service cron start
# 关闭cron
service cron stop
# 重启cron
service cron restart
```

### crontab 命令

通过 crontab 命令，我们可以在固定的间隔时间执行指定的系统指令或 shell script 脚本。时间间隔的单位可以是
分钟、小时、日、月、周及以上的任意组合。这个命令非常设合周期性的日志分析或数据备份等工作。

#### crontab 命令格式

```text
crontab [-u user] file
crontab [-u user] [ -e | -l | -r ]

-u user：用来设定某个用户的crontab服务，例如，“-u ixdba”表示设定ixdba用户的crontab服务，此参数一般有root用户来运行。
file：file是命令文件的名字,表示将file做为crontab的任务列表文件并载入crontab。如果在命令行中没有指定这个文件，crontab命令将接受标准输入（键盘）上键入的命令，并将它们载入crontab。
-e：编辑某个用户的crontab文件内容。如果不指定用户，则表示编辑当前用户的crontab文件。
-l：显示某个用户的crontab文件内容，如果不指定用户，则表示显示当前用户的crontab文件内容。
-r：从/var/spool/cron目录中删除某个用户的crontab文件，如果不指定用户，则默认删除当前用户的crontab文件。
-i：在删除用户的crontab文件时给确认提示。
```

#### crontab 文件格式

```text
minute   hour   day   month   week   command
# Example of job definition:
.---------------------------------- minute (0 - 59) 表示分钟
|  .------------------------------- hour (0 - 23)   表示小时
|  |  .---------------------------- day of month (1 - 31)   表示日期
|  |  |  .------------------------- month (1 - 12) OR jan,feb,mar,apr ... 表示月份
|  |  |  |  .---------------------- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat  表示星期（0 或 7 表示星期天）
|  |  |  |  |  .------------------- username  以哪个用户来执行
|  |  |  |  |  |            .------ command  要执行的命令，可以是系统命令，也可以是自己编写的脚本文件
|  |  |  |  |  |            |
*  *  *  *  * user-name  command to be executed
```

示例：

```text
*/1 * * * * service httpd restart	               每一分钟 重启httpd服务
0 */1 * * * service httpd restart	               每一小时 重启httpd服务
30 21 * * * service httpd restart	               每天 21：30 分 重启httpd服务
26 4 1,5,23,28 * * service httpd restart	       每月的1号，5号 23 号 28 号 的4点26分，重启httpd服务
26 4 1-21 * * service httpd restart	               每月的1号到21号 的4点26分，重启httpd服务
*/2 * * * * service httpd restart	               每隔两分钟 执行，偶数分钟 重启httpd服务
1-59/2 * * * * service httpd restart	           每隔两分钟 执行，奇数 重启httpd服务
0 23-7/1 * * * service httpd restart	           每天的晚上11点到早上7点 每隔一个小时 重启httpd服务
0,30 18-23 * * * service httpd restart	           每天18点到23点 每隔30分钟 重启httpd服务
0-59/30 18-23 * * * service httpd restart	       每天18点到23点 每隔30分钟 重启httpd服务
59 1 1-7 4 0 /root/a.sh                            四月的第一个星期日 01:59 分运行脚本 /root/a.sh

*表示任何时候都匹配
"a,b,c" 表示a 或者 b 或者c 执行命令
"a-b" 表示a到b 之间 执行命令
"*/a" 表示每 a单位 执行一次
```

#### crontab 配置文件

```text
/etc/crontab	     全局配置文件
/etc/cron.d	         这个目录用来存放任何要执行的crontab文件或脚本
/etc/cron.deny	     该文件中所列用户不允许使用crontab命令
/etc/cron.allow	     该文件中所列用户允许使用crontab命令
/var/spool/cron/	 所有用户crontab文件存放的目录,以用户名命名，比如你是root 用户，那么当你添加任务是，就会在该路径下有一个root文件。
/etc/cron.deny	     该文件中所列用户不允许使用crontab命令
/var/log/cron	     crontab的日志文件
```

### 注意事项

1. 环境变量的值，在 crontab 文件中获取不到，可以写脚本替代
2. 在 crontab 中%是有特殊含义的，表示换行的意思。如果要用的话必须进行转义\%
