---
title: Nginx日志按天切割
date: 2022-10-18 16:20:26
categories: Nginx
tags: Nginx
---
# Nginx日志按天切割
Nginx默认的发布不支持对日志文件按日期或者按日志量来分割，此处实现的功能：在每天凌晨00:00把前⼀天的Nginx⽇志（access.log和error.log）分别重命名为access-yyyy-mm-dd.log和log-xxxx-xx-xx.log格式，
例如：access-2022-10-18.log，error-2022-10-18.log

## Linux环境脚本
```shell
vim /usr/local/nginx/sbin/auto_cut_log.sh
```
```shell
#!/bin/bash
#Nginx⽇志⽂件所在⽬录
LOG_PATH=/usr/local/nginx/logs/
#获取昨天的⽇期
YESTERDAY=$(date -d "yesterday" +%Y-%m-%d)
#nginx服务的pid⽂件路径
PID=/run/nginx.pid
#分割⽇志
mv ${LOG_PATH}access.log ${LOG_PATH}access-${YESTERDAY}.log
mv ${LOG_PATH}error.log ${LOG_PATH}error-${YESTERDAY}.log
#向Nginx主进程发送USR1信号，重新打开⽇志⽂件
kill -USR1 `cat ${PID}`
```
>有关USR1的介绍：USR是User-defined的缩写，即用户定义的,USR1通常被用来告知应用程序重载配置文件

## 增加脚本文件执行权限
```shell
chmod +x /usr/local/nginx/sbin/auto_cut_log.sh
```

## 添加定时任务
```shell
crontab -e
00 00 * * * /bin/bash /usr/local/nginx/sbin/auto_cut_log.sh
```
>参考链接：https://blog.csdn.net/klipse/article/details/125019896
