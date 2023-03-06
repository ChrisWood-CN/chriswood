---
title: Nginx常用操作及配置
date: 2022-09-30 23:24:15
updated: 2023-03-06 09:53:15
categories: Nginx
tags: Nginx
---
# Nginx常用操作及配置

### 常用操作

``` shell
#强制停止Nginx
kill -9 nginx 
start nginx
nginx -s quit
nginx -s reload
```

### 常见配置

``` shell
#指定运行worker进程的用户和组
user  nginx;
#指定nginx守护进程的pid文件
pid /path/to/pid_file;
worker_rlimit_nofile number; #设置所有worker进程最大可以打开的文件数，默认为1024
worker_rlimit_core size; #指明所有worker进程所能够使用的总体的最大核心文件大小，保持默认即可
# 启动n个worker进程，这里的n为了避免上下文切换，通常设置为cpu总核心数-1或等于总核心数
worker_processes 1;
worker_cpu_affinity cpumask …; #将进程绑定到某cpu中，避免频繁刷新缓存
#cpumask：使用8位二进制表示cpu核心，如：
#0000 0001 第一颗cpu核心
#0000 0010 第二颗cpu核心
#0000 0100 第三颗cpu核心
#0000 1000 第四颗cpu核心
#0001 0000 第五颗cpu核心
#0010 0000 第六颗cpu核心
#0100 0000 第七颗cpu核心
#1000 0000 第八颗cpu核心
timer_resolution interval; #计时器解析度。降低此值，可减少gettimeofday()系统调用的次数
worker_priority number; #指明worker进程的nice值

events {
  #master调度用户请求至各worker进程时使用的负载均衡锁；on表示能让多个worker轮流地、序列化地去响应新请求
  accept_mutex {off|on}; 
  # 每个进程的最大连接数量
  worker_connections 1024;
}

http {
  include mime.types;
  default_type application/octet-stream;
  sendfile on;
  keepalive_timeout 65;

  # 演示如何强制http跳转https
  server {
    listen 80;
    server_name test.com;

    # http强制跳转到https
    rewrite ^(.*)$ https://$server_name$1 permanent;
  }

  # 演示如何配置微信支付的校验文件
  server {
    listen 80;
    server_name localhost;

    # 默认根路径
    location / {
      root index.html;
    }
    # 微信支付校验文件，可以直接配置访问名称
    location ^~/MP_verify_2g3uEjrB5B2LIbNl.txt {
      alias /home/MP_verify_2g3uEjrB5B2LIbNl.txt;
    }
    # 微信支付校验文件，也可以通过正则配置
    location ~^/MP_verify_[a-zA-Z0-9]*\.(txt)$ {
      root /home/;
      rewrite ^/home/(.txt)$ /home/$1 last;
    }
  }

  # 演示root和alias两种配置静态资源的区别
  server {
    listen 80;
    server_name localhost;

    # 用root方式，location中的路径会拼加到root的地址后面
    # 请求路径为：http://localhost:8080/files/index.jpg    实际访问为：/home/files/index.jpg
    location ~^/files/ {
      root /home/;
      index index.html index.htm;
    }
    # 用alias方式，location中的路径不会拼加到alias的地址后面
    # 这请求路径为：http://localhost:8080/files/index.jpg    实际访问为：/home/index.jpg
    location ~^/files/ {
      alias /home/;
      index index.html index.htm;
    }
  }

  # 演示请求后台接口代理配置
  server {
    listen 8080;
    server_name localhost;

    #################### 第一种场景 ####################
    # 请求路径为：http://127.0.0.1:8080/api/getUser   实际代理为：http://127.0.0.1:8000/api/getUser
    location ^~/api/ {
      proxy_pass http://127.0.0.1:8000;
      proxy_set_header Host $http_host; #后台可以获取到完整的ip+端口号
      proxy_set_header X-Real-IP $remote_addr; #后台可以获取到用户访问的真实ip地址
    }
    # 请求路径为：http://127.0.0.1:8080/api/getUser   实际指向为：http://127.0.0.1:8000/api/getUser
    location ^~/api {
      proxy_pass http://127.0.0.1:8000;
      proxy_set_header Host $http_host; #后台可以获取到完整的ip+端口号
      proxy_set_header X-Real-IP $remote_addr; #后台可以获取到用户访问的真实ip地址
    }

    #################### 第二种场景 ####################
    # 请求路径为：http://127.0.0.1:8080/api/getUser   实际代理为：http://127.0.0.1:8000/getUser
    location ^~/api/ {
      proxy_pass http://127.0.0.1:8000/;
      proxy_set_header Host $http_host; #后台可以获取到完整的ip+端口号
      proxy_set_header X-Real-IP $remote_addr; #后台可以获取到用户访问的真实ip地址
    }
    # 请求路径为：http://127.0.0.1:8080/api/getUser   实际代理为：http://127.0.0.1:8000//getUser
    location ^~/api {
      proxy_pass http://127.0.0.1:8000/;
      proxy_set_header Host $http_host; #后台可以获取到完整的ip+端口号
      proxy_set_header X-Real-IP $remote_addr; #后台可以获取到用户访问的真实ip地址
    }

    #################### 第三种场景 ####################
    # 请求路径为：http://127.0.0.1:8080/api/getUser   实际代理为：http://127.0.0.1:8000/user/getUser
    location ^~/api {
      proxy_pass http://127.0.0.1:8000/user;
      proxy_set_header Host $http_host; #后台可以获取到完整的ip+端口号
      proxy_set_header X-Real-IP $remote_addr; #后台可以获取到用户访问的真实ip地址
    }
    # 请求路径为：http://127.0.0.1:8080/api/getUser   实际代理为：http://127.0.0.1:8000/usergetUser
    location ^~/api/ {
      proxy_pass http://127.0.0.1:8000/user;
      proxy_set_header Host $http_host; #后台可以获取到完整的ip+端口号
      proxy_set_header X-Real-IP $remote_addr; #后台可以获取到用户访问的真实ip地址
    }

    #################### 第四种场景 ####################
    # 请求路径为：http://127.0.0.1:8080/api/getUser   实际代理为：http://127.0.0.1:8000/user/getUser
    location ^~/api/ {
      proxy_pass http://127.0.0.1:8000/user/;
      proxy_set_header Host $http_host; #后台可以获取到完整的ip+端口号
      proxy_set_header X-Real-IP $remote_addr; #后台可以获取到用户访问的真实ip地址
    }
    # 请求路径为：http://127.0.0.1:8080/api/getUser   实际代理为：http://127.0.0.1:8000/user//getUser
    location ^~/api {
      proxy_pass http://127.0.0.1:8000/user/;
      proxy_set_header Host $http_host; #后台可以获取到完整的ip+端口号
      proxy_set_header X-Real-IP $remote_addr; #后台可以获取到用户访问的真实ip地址
    }
  }

  # 演示前端项目部署加访问前缀的nginx配置
  server {
    listen 8090;
    server_name localhost;

    # 部署路径：/home/web/my_demo
    # 访问路径为：http://localhost:8090/
    location / {
      try_files $uri $uri/ /index.html;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header Host $http_host;
      root /home/web/my_demo/;
      index index.html index.htm;
    }

    # 部署路径：/home/web/my_demo
    # 访问路径为：http://localhost:8090/my_demo/
    # 如果location路径最后没有配置斜杠，则浏览器输入访问地址后，路径最后会自动拼一个斜杠
    location ^~/my_demo/ {
      try_files $uri $uri/ /my_demo/index.html;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header Host $http_host;
      root /home/web/;
      index index.html index.htm;
    }
  }
}
```

##nginx.conf配置
### nginx的HTTP配置主要包括四个区块
~~~
http {//协议级别
  include mime.types;
  default_type application/octet-stream;
  keepalive_timeout 65;
  gzip on;
  upstream {//负载均衡配置
    …
  }
  server {//服务器级别，每个server类似于httpd中的一个
    listen 80;
    server_name localhost;
    location / {//请求级别，类似于httpd中的，用于定义URL与本地文件系统的映射关系
      root html;
      index index.html index.htm;
    } 
  }
}
~~~
### location配置
#### location 匹配优先级
- = 精确匹配会第一个被处理。如果发现精确匹配，nginx停止搜索其他匹配。 
- 普通字符匹配，正则表达式规则和长的块规则将被优先和查询匹配，也就是说如果该项匹配还需去看有没有正则表达式匹配和更长的匹配。
- ^~ 则只匹配该规则，nginx停止搜索其他匹配，否则nginx会继续处理其他location指令。
- 最后匹配理带有"~"和"~*"的指令，如果找到相应的匹配，则nginx停止搜索其他匹配；当没有正则表达式或者没有正则表达式被匹配的情况下，那么匹配程度最高的逐字匹配指令会被使用。
#### location规则
##### 1.location和proxy_pass都带/，则真实地址不带location匹配目录
~~~
location /api/ {
    proxy_pass http://127.0.0.1:8080/;
    #访问地址：example.taotaozn.com/api/upload-->http://127.0.0.1:8080/upload
}
~~~
##### 2.location不带/，proxy_pass带/，则真实地址会带/
~~~
location /api {
    proxy_pass http://127.0.0.1:8080/;
    #访问地址： example.taotaozn.com/api/upload-->http://127.0.0.1:8080//upload
}
~~~
##### 3.location带/，proxy_pass不带/，则真实地址会带location匹配目录/api/
~~~
location /api/ {
    proxy_pass http://127.0.0.1:8080;
    #访问地址： example.taotaozn.com/api/upload-->http://127.0.0.1:8080/api/upload
}
~~~
##### 4.location和proxy_pass都不带/，则真实地址会带location匹配目录/api/
~~~
location /api {
    proxy_pass http://127.0.0.1:8080;
    #访问地址： www.test.com/api/upload-->http://127.0.0.1:8080/api/upload
}
~~~
##### 5.同1，location和proxy_pass都带/，但 proxy_pass带地址
~~~
location /api/ {
    proxy_pass http://127.0.0.1:8080/server/;
    #访问地址： www.test.com/api/upload-->http://127.0.0.1:8080/server/upload
}
~~~
##### 6.同2，但 proxy_pass带地址，则真实地址会多个/
~~~
location /api {
    proxy_pass http://127.0.0.1:8080/server/;
    #访问地址： www.test.com/api/upload-->http://127.0.0.1:8080/server//upload
}
~~~
##### 7.同3，但 proxy_pass带地址，则真实地址会直接连起来
~~~
location /api/ {
    proxy_pass http://127.0.0.1:8080/server;
    #访问地址： www.test.com/api/upload-->http://127.0.0.1:8080/serverupload
}
~~~
##### 8.同4，但 proxy_pass带地址，则真实地址匹配地址会替换location匹配目录
~~~
location /api{
    proxy_pass http://127.0.0.1:8080/server;
    #访问地址： www.test.com/api/upload-->http://127.0.0.1:8080/server/upload
}
~~~
#### location语法
~~~
location [=||*|^~] /uri/ { … }
~~~
- = 严格匹配。如果请求匹配这个location，那么将停止搜索并立即处理此请求
- ~ 区分大小写匹配(可用正则表达式)
- ~* 不区分大小写匹配(可用正则表达式)
- !~ 区分大小写不匹配
- !~* 不区分大小写不匹配
- ^~ 如果把这个前缀用于一个常规字符串,那么告诉nginx 如果路径匹配那么不测试正则表达式

#### alias与root的区别
- root 实际访问文件路径会拼接URL中的路径
- alias 实际访问文件路径不会拼接URL中的路径
~~~
location ^~ /scootor/ { 
    alias /usr/local/nginx/html/static/; 
}
#请求：http://example.taotaozn.com/scootor/index.html
#实际访问：/usr/local/nginx/html/static/index.html文件

location ^~ /scootor/ { 
    root /usr/local/nginx/html/; 
}
#请求：http://example.taotaozn.com/scootor/index.html
#实际访问：/usr/local/nginx/html/scootor/index.html文件
~~~
#### rewrite
语法：rewrite regex replacement flag
~~~
location  /images {
    rewrite ^/images/(.*\.jpg)$ /imgs/$1 break;
}
~~~
##### last和break关键字的区别
- last 和 break 当出现在location 之外时，两者的作用是一致的没有任何差异
- last 和 break 当出现在location 内部时：
    - last: rewrite后会跳出location作用域，重新开始再走一次刚才的行为，
      当前的匹配结束，继续下一个匹配，最多匹配10个到20个，一旦此rewrite规则重写完成后，
      就不再被后面其它的rewrite规则进行处理 而是由UserAgent重新对重写后的URL再一次发起请求，
      并从头开始执行类似的过程
    - break: rewrite后不会跳出location 作用域，它的生命也在这个location中终结
      中止Rewrite，不再继续匹配，一旦此rewrite规则重写完成后，由UserAgent对新的URL重新发起请求，
      且不再会被当前location内的任何rewrite规则所检查
##### permanent和redirect关键字的区别
- rewrite … permanent 永久性重定向，请求日志中的状态码为301
- rewrite … redirect 临时重定向，请求日志中的状态码为302

#### try_files
~~~
location / {
    try_files $uri $uri/ /index.html?$args;
}
# 语法：try_files file1 [file2 ... filen] fallback
~~~

#### if
语法：if (condition) {…}
应用于：server和location
##### 常见condition
- 变量名（变量值为空串，或者以“0”开始，则为false，其它的均为true）
- 以变量为操作数构成的比较表达式（可使用=，!=类似的比较操作符进行测试）
- 正则表达式的模式匹配操作
  - ~：区分大小写的模式匹配检查
  - ~*：不区分大小写的模式匹配检查
  - !~和 !~*：对上面两种取反
- 指定路径为文件的可能性（-f，!-f)
- 指定路径为目录的可能性（-d，!-d）
- 文件的存在性（-e，!-e）
- 文件是否有执行权限（-x，!-x）
###### 浏览器实现分离案例
~~~
if ($http_user_agent ~ Firefox) {
  rewrite ^(.*)$ /firefox/$1 break;
}

if ($http_user_agent ~ MSIE) {
  rewrite ^(.*)$ /msie/$1 break;
}

if ($http_user_agent ~ Chrome) {
  rewrite ^(.*)$ /chrome/$1 break;
}
~~~

#### nginx防盗链配置
语法：valid_referers [none|blocked|server_names] ... 默认值：none
这个指令在referer头的基础上为 $invalid_referer 变量赋值，其值为0或1。
如果valid_referers列表中没有Referer头的值， $invalid_referer将被设置为1
应用于：server和location
###### 防盗链案例
~~~
location ~* \.(jpg|gif|jpeg|png)$ {
  valid_referers none blocked www.test.com;
  if ($invalid_referer) {
    rewrite ^/ http://www.test.com/403.html;
  }
}
~~~

#### nginx的cors配置
~~~
server {
    listen       80;
    server_name  localhost;
    #判断请求域名是否是指定域名的子域名，如果是，则将内置域名赋值给内置变量$allow_url，便于指定Access-Control-Allow-Origin
    if ( $http_origin ~ http://(.*).taotaozn.com){
          set $allow_url $http_origin;
    }
    #是否允许请求带有验证信息
    add_header Access-Control-Allow-Credentials true;
    #允许跨域访问的域名,可以是一个域的列表，也可以是通配符*
    add_header Access-Control-Allow-Origin  $allow_url;
    #允许脚本访问的返回头
    add_header Access-Control-Allow-Headers 'x-requested-with,content-type,Cache-Control,Pragma,Date,x-timestamp';
    #允许使用的请求方法，以逗号隔开
    add_header Access-Control-Allow-Methods 'POST,GET,OPTIONS,PUT,DELETE';
    #允许自定义的头部，以逗号隔开,大小写不敏感
    add_header Access-Control-Expose-Headers 'WWW-Authenticate,Server-Authorization';
    #P3P支持跨域cookie操作
    add_header P3P 'policyref="/w3c/p3p.xml", CP="NOI DSP PSAa OUR BUS IND ONL UNI COM NAV INT LOC"';
    add_header test  1;

    if ($request_method = 'OPTIONS') {
         return 204;
     }
    location  / {
         root html;
    }
    location = /demo/test1.html {
         proxy_pass http://www.tataozn.com/demo/test1.html;
    }
    
    error_page   500 502 503 504  /50x.html;
    location  /50x.html {
        root   html;
    }
}
~~~

#### nginx通过expires配置缓存
语法：expires [time|@time-of-day|epoch|max|off]
默认值：expires off
应用于：http、server和location
>注意：expires仅仅适用于200, 204, 301, 302,和304应答
~~~
#经常使用的配置
#告知浏览器缓存此文件并设置缓存时间
location ~ .*.(gif|jpg|jpeg|png|bmp|swf)$ {
    expires 10s;#缓存2秒
    #expires 2m;#缓存2分钟
    #expires 2h;#缓存2小时
    #expires 2d;#缓存2天
    root   html;
}
~~~

#### nginx的gzip配置
语法：gzip on|off
默认值：gzip off
应用于：http, server, location, location中的if
~~~
# 搭配
gzip_types：默认值为gzip_types text/html ；为除“text/html”之外的MIME类型启用压缩，“text/html”总是会被压缩。
gzip_min_length：默认值为gzip_min_length 0 ；设置被压缩的最小请求，单位为bytes。少于这个值大小的请求将不会被压缩，这个值由请求头中的Content-Length字段决定。
gzip_buffers ：默认值为gzip_buffers 4 4k/8k ；指定缓存压缩应答的缓冲区数量和大小，如果不设置，一个缓存区的大小为分页大小，根据环境的不同可能是4k或8k。
gzip_comp_level ：默认值为gzip_comp_level 1 ；指定压缩等级，其值从1到9，1为最小化压缩（处理速度快），9为最大化压缩（处理速度慢）。
~~~
~~~
location  / {
    # 对js、css、html格式的文件启用gzip压缩功能,图片格式由于压缩比例太小，且压缩耗费cpu不建议压缩
    gzip on; # 启用gzip压缩，默认是off，不启用
    gzip_types application/javascript text/css;#为除“text/html”之外的MIME类型启用压缩，“text/html”总是会被压缩。
    gzip_min_length 1024; # 所压缩文件的最小值，小于这个的不会压缩
    gzip_buffers 4 1k; # 设置压缩响应的缓冲块的大小和个数，默认是内存一个页的大小
    gzip_comp_level 1; # 压缩水平，默认1。取值范围1-9，取值越大压缩比率越大，但越耗cpu时间
    root  html;
}
~~~
