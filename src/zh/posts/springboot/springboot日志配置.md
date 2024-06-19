---
title: springboot日志配置 
date: 2023-02-07 14:59:47 
categories: springboot
tags:
- springboot
- springboot配置
---

## 默认日志 Logback

默认情况下，Spring Boot会用Logback来记录日志，并用INFO级别输出到控制台。 spring-boot-starter其中包含了 spring-boot-starter-logging，该依赖内容就是 Spring Boot
默认的日志框架 logback。
> 日志级别从低到高分为 TRACE < DEBUG < INFO < WARN < ERROR < FATAL

> 如果设置为 WARN ，则低于 WARN 的信息都不会输出。

> Spring Boot中默认配置ERROR、WARN和INFO级别的日志输出到控制台

还可以通过启动您的应用程序 --debug 标志来启用“调试”模式。

- 在运行命令后加入--debug标志，如

~~~
$ java -jar springTest.jar --debug
~~~

- 在application.properties中配置debug=true

> 该属性置为true的时候，核心Logger（包含嵌入式容器、hibernate、spring）会输出更多内容，但是自己应用的日志并不会输出为DEBUG级别

## 文件输出

默认情况下，Spring Boot将日志输出到控制台，不会写到日志文件。

- 在application.properties或application.yml配置。 这样只能配置简单的场景，保存路径、日志格式等，复杂的场景（区分 info 和 error 的日志、每天产生一个日志文件等）满足不了，只能自定义配置

~~~
logging:
  level:
    root: info #整个项目的日志级别为info
    com.taotao: debug  #com.taotao包下所有class以debug级别输出
    org.springframework: warn #org.springframework包下所有class以warn级别输出
  pattern:
    console: "%d-%msg%n"
  path: ./logs  #默认会在设置的 path 生成一个spring.log 文件
  file: ./logs/test-log #指定文件名
~~~

> 注：path file 二者不能同时使用，如若同时使用，则只有logging.file生效 默认情况下，日志文件的大小达到10MB时会切分一次，产生新的日志文件，默认级别为：ERROR、WARN、INFO

## 自定义日志配置

根据不同的日志系统，你可以按如下规则组织配置文件名，就能被正确加载

- Logback：logback-spring.xml, logback-spring.groovy, logback.xml, logback.groovy
- Log4j：log4j-spring.properties, log4j-spring.xml, log4j.properties, log4j.xml
- Log4j2：log4j2-spring.xml, log4j2.xml
- JDK (Java Util Logging)：logging.properties

> Spring Boot官方推荐优先使用带有-spring的文件名作为你的日志配置（如使用logback-spring.xml，而不是logback.xml），命名为logback-spring.xml的日志配置文件，spring boot可以为它添加一些spring boot特有的配置项（下面会提到）。 默认的命名规则，并且放在 src/main/resources 下面即可

如果想完全掌控日志配置，但又不想用logback.xml作为Logback配置的名字，application.yml可以通过logging.config属性指定自定义的名字

~~~
logging:
  config: classpath:log.xml
~~~

### 根节点 configuration

1.configuration有5个子节点 2.configuration属性

- scan:当此属性设置为true时，配置文件如果发生改变，将会被重新加载，默认值为true。
- scanPeriod:设置监测配置文件是否有修改的时间间隔，如果没有给出时间单位，默认单位是毫秒。当scan为true时，此属性生效。默认的时间间隔为1分钟。
- debug:当此属性设置为true时，将打印出logback内部日志信息，实时查看logback运行状态。默认值为false。

~~~xml
<?xml version="1.0" encoding="UTF-8"?>

<configuration>
    <property name="log.path" value="/pethouse/server/log"/>
    <include resource="org/springframework/boot/logging/logback/base.xml"/>
    <!--  ...-->
</configuration>
~~~

### 子节点一 root

- 1.root节点是必选节点，用来指定最基础的日志输出级别，只有一个level属性
- 2.level:用来设置打印级别，大小写无关：TRACE, DEBUG, INFO, WARN, ERROR, ALL 和 OFF，不能设置为INHERITED或者同义词NULL。 默认是DEBUG。
- 3.可以包含零个或多个元素，标识这个appender将会添加到这个loger

~~~xml
    <!-- 系统日志输出 -->
<appender name="file_info" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>${log.path}/sys-info.log</file>
    <!-- 循环政策：基于时间创建日志文件 -->
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
        <!-- 日志文件名格式 -->
        <fileNamePattern>${log.path}/sys-info.%d{yyyy-MM-dd}.log</fileNamePattern>
        <!-- 日志最大的历史 60天 -->
        <maxHistory>60</maxHistory>
    </rollingPolicy>
    <filter class="ch.qos.logback.classic.filter.LevelFilter">
        <!-- 过滤的级别 -->
        <level>INFO</level>
        <!-- 匹配时的操作：接收（记录） -->
        <onMatch>ACCEPT</onMatch>
        <!-- 不匹配时的操作：拒绝（不记录） -->
        <onMismatch>DENY</onMismatch>
    </filter>
</appender>

<appender name="file_error" class="ch.qos.logback.core.rolling.RollingFileAppender">
  <file>${log.path}/sys-error.log</file>
  <!-- 循环政策：基于时间创建日志文件 -->
  <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
      <!-- 日志文件名格式 -->
      <fileNamePattern>${log.path}/sys-error.%d{yyyy-MM-dd}.log</fileNamePattern>
      <!-- 日志最大的历史 60天 -->
      <maxHistory>60</maxHistory>
  </rollingPolicy>
  <filter class="ch.qos.logback.classic.filter.LevelFilter">
      <!-- 过滤的级别 -->
      <level>ERROR</level>
      <!-- 匹配时的操作：接收（记录） -->
      <onMatch>ACCEPT</onMatch>
      <!-- 不匹配时的操作：拒绝（不记录） -->
      <onMismatch>DENY</onMismatch>
  </filter>
</appender>

<!-- info异步输出 -->
<appender name="async_info" class="com.yomahub.tlog.core.enhance.logback.async.AspectLogbackAsyncAppender">
  <!-- 不丢失日志.默认的,如果队列的80%已满,则会丢弃TRACT、DEBUG、INFO级别的日志 -->
  <discardingThreshold>0</discardingThreshold>
  <!-- 更改默认的队列的深度,该值会影响性能.默认值为256 -->
  <queueSize>512</queueSize>
  <!-- 添加附加的appender,最多只能添加一个 -->
  <appender-ref ref="file_info"/>
</appender>

<!-- error异步输出 -->
<appender name="async_error" class="com.yomahub.tlog.core.enhance.logback.async.AspectLogbackAsyncAppender">
  <!-- 不丢失日志.默认的,如果队列的80%已满,则会丢弃TRACT、DEBUG、INFO级别的日志 -->
  <discardingThreshold>0</discardingThreshold>
  <!-- 更改默认的队列的深度,该值会影响性能.默认值为256 -->
  <queueSize>512</queueSize>
  <!-- 添加附加的appender,最多只能添加一个 -->
  <appender-ref ref="file_error"/>
</appender>
<root level="info">
  <appender-ref ref="console"/>
  <appender-ref ref="async_info"/>
  <appender-ref ref="async_error"/>
  <appender-ref ref="file_console"/>
</root>
~~~

### 子节点二 contextName 设置上下文名称

- 1.每个logger都关联到logger上下文，默认上下文名称为“default”。但可以使用设置成其他名字，用于区分不同应用程序的记录。
- 2.一旦设置，不能修改,可以通过%contextName来打印日志上下文名称，一般来说我们不用这个属性，可有可无。
~~~xml
<contextName>pethouse-server</contextName>
~~~

### 子节点三 property 设置变量

- 1.用来定义变量值的标签， 有两个属性，name和value；其中name的值是变量的名称，value的值时变量定义的值。
- 2.通过定义的值会被插入到logger上下文中。定义变量后，可以使“${}”来使用变量
~~~xml
<property name="log.path" value="/pethouse/server/log"/>
~~~

### 子节点四 appender

- 1.appender用来格式化日志输出节点，有2个属性name和class，class用来指定哪种输出策略，常用就是控制台输出策略和文件输出策略。

##### 控制台输出 ConsoleAppender

~~~
<encoder>表示对日志进行编码：
%d{HH: mm:ss.SSS}——日志输出时间
%thread——输出日志的进程名字，这在Web应用以及异步任务处理中很有用
%-5level——日志级别，并且使用5个字符靠左对齐
%logger{36}——日志输出者的名字
%msg——日志消息
%n——平台的换行符
ThresholdFilter为系统定义的拦截器，例如我们用ThresholdFilter来过滤掉ERROR级别以下的日志不输出到文件中。如果不用记得注释掉，不然你控制台会发现没日志
~~~

~~~xml
<configuration>
    <contextName>pethouse-server</contextName>
    <!-- 彩色日志 -->
    <!-- 彩色日志依赖的渲染类 -->
    <conversionRule conversionWord="clr" converterClass="org.springframework.boot.logging.logback.ColorConverter"/>
    <conversionRule conversionWord="wex"
                    converterClass="org.springframework.boot.logging.logback.WhitespaceThrowableProxyConverter"/>
    <conversionRule conversionWord="wEx"
                    converterClass="org.springframework.boot.logging.logback.ExtendedWhitespaceThrowableProxyConverter"/>
    <!-- 彩色日志格式 -->
    <property name="CONSOLE_LOG_PATTERN"
              value="${CONSOLE_LOG_PATTERN:-%clr(%d{yyyy-MM-dd HH:mm:ss.SSS}){faint} %clr(${LOG_LEVEL_PATTERN:-%5p}) %clr(${PID:- }){magenta} %clr(---){faint} %clr([%15.15t]){faint} %clr(%-40.40logger{39}){cyan} %clr(:){faint} %m%n${LOG_EXCEPTION_CONVERSION_WORD:-%wEx}}"/>
    <!--输出到控制台 ConsoleAppender-->
    <appender name="consoleLog1" class="ch.qos.logback.core.ConsoleAppender">
        <!--展示格式 layout-->
        <layout class="ch.qos.logback.classic.PatternLayout">
            <pattern>%d{HH:mm:ss.SSS} %contextName [%thread] %-5level %logger{36} - %msg%n</pattern>
        </layout>
    </appender>
    <appender name="consoleLog2" class="ch.qos.logback.core.ConsoleAppender">
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>ERROR</level>
        </filter>
        <encoder>
            <Pattern>${CONSOLE_LOG_PATTERN}</Pattern>
            <!-- 设置字符集 -->
            <charset>UTF-8</charset>
        </encoder>
    </appender>
    <!--指定最基础的日志输出级别-->
    <root level="INFO">
        <!--appender将会添加到这个loger-->
        <appender-ref ref="consoleLog1"/>
        <appender-ref ref="consoleLog2"/>
    </root>
</configuration>
~~~

##### 输出到文件 RollingFileAppender

另一种常见的日志输出到文件，随着应用的运行时间越来越长，日志也会增长的越来越多，将他们输出到同一个文件并非一个好办法。RollingFileAppender用于切分文件日志

~~~xml
<appender name="fileInfoLog" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <!--如果只是想要 Info 级别的日志，只是过滤 info 还是会输出 Error 日志，因为 Error 的级别高，
    所以我们使用下面的策略，可以避免输出 Error 的日志-->
    <filter class="ch.qos.logback.classic.filter.LevelFilter">
        <!--过滤 Error-->
        <level>ERROR</level>
        <!--匹配到就禁止-->
        <onMatch>DENY</onMatch>
        <!--没有匹配到就允许-->
        <onMismatch>ACCEPT</onMismatch>
    </filter>
    <!--日志名称，如果没有File 属性，那么只会使用FileNamePattern的文件路径规则
        如果同时有<File>和<FileNamePattern>，那么当天日志是<File>，明天会自动把今天
        的日志改名为今天的日期。即，<File> 的日志都是当天的。
    -->
    <File>${logback.logdir}/info.${logback.appname}.log</File>
    <!--滚动策略，按照时间滚动 TimeBasedRollingPolicy-->
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
        <!--文件路径,定义了日志的切分方式——把每一天的日志归档到一个文件中,以防止日志填满整个磁盘空间-->
        <FileNamePattern>${logback.logdir}/info.${logback.appname}.%d{yyyy-MM-dd}.log</FileNamePattern>
        <!--只保留最近90天的日志-->
        <maxHistory>90</maxHistory>
        <!--用来指定日志文件的上限大小，那么到了这个值，就会删除旧的日志-->
        <totalSizeCap>1GB</totalSizeCap>
    </rollingPolicy>
    <!--日志输出编码格式化-->
    <encoder>
        <charset>UTF-8</charset>
        <pattern>%d [%thread] %-5level %logger{36} %line - %msg%n</pattern>
    </encoder>
</appender>


<appender name="fileErrorLog" class="ch.qos.logback.core.rolling.RollingFileAppender">
<!--如果只是想要 Error 级别的日志，那么需要过滤一下，默认是 info 级别的，ThresholdFilter-->
<filter class="ch.qos.logback.classic.filter.ThresholdFilter">
    <level>Error</level>
</filter>
<!--日志名称，如果没有File 属性，那么只会使用FileNamePattern的文件路径规则
    如果同时有<File>和<FileNamePattern>，那么当天日志是<File>，明天会自动把今天
    的日志改名为今天的日期。即，<File> 的日志都是当天的。
-->
<File>${logback.logdir}/error.${logback.appname}.log</File>
<!--滚动策略，按照时间滚动 TimeBasedRollingPolicy-->
<rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
    <!--文件路径,定义了日志的切分方式——把每一天的日志归档到一个文件中,以防止日志填满整个磁盘空间-->
    <FileNamePattern>${logback.logdir}/error.${logback.appname}.%d{yyyy-MM-dd}.log</FileNamePattern>
    <!--只保留最近90天的日志-->
    <maxHistory>90</maxHistory>
    <!--用来指定日志文件的上限大小，那么到了这个值，就会删除旧的日志-->
    <totalSizeCap>1GB</totalSizeCap>
</rollingPolicy>
<!--日志输出编码格式化-->
<encoder>
    <charset>UTF-8</charset>
    <pattern>%d [%thread] %-5level %logger{36} %line - %msg%n</pattern>
</encoder>
</appender>
~~~

##### 异步输出 AspectLogbackAsyncAppender
基于以上两种基础输出做了一层异步处理的包装，每个AspectLogbackAsyncAppender最多只能包装一个appender
~~~xml
<appender name="file_error" class="ch.qos.logback.core.rolling.RollingFileAppender">
  <file>${log.path}/sys-error.log</file>
  <!-- 循环政策：基于时间创建日志文件 -->
  <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
      <!-- 日志文件名格式 -->
      <fileNamePattern>${log.path}/sys-error.%d{yyyy-MM-dd}.log</fileNamePattern>
      <!-- 日志最大的历史 60天 -->
      <maxHistory>60</maxHistory>
  </rollingPolicy>
  <filter class="ch.qos.logback.classic.filter.LevelFilter">
      <!-- 过滤的级别 -->
      <level>ERROR</level>
      <!-- 匹配时的操作：接收（记录） -->
      <onMatch>ACCEPT</onMatch>
      <!-- 不匹配时的操作：拒绝（不记录） -->
      <onMismatch>DENY</onMismatch>
  </filter>
</appender>

<!-- error异步输出 -->
<appender name="async_error" class="com.yomahub.tlog.core.enhance.logback.async.AspectLogbackAsyncAppender">
  <!-- 不丢失日志.默认的,如果队列的80%已满,则会丢弃TRACT、DEBUG、INFO级别的日志 -->
  <discardingThreshold>0</discardingThreshold>
  <!-- 更改默认的队列的深度,该值会影响性能.默认值为256 -->
  <queueSize>512</queueSize>
  <!-- 添加附加的appender,最多只能添加一个 -->
  <appender-ref ref="file_error"/>
</appender>
~~~

### 子节点五 logger

#### 属性

- name:用来指定受此logger约束的某一个包或者具体的某一个类。
- level:用来设置打印级别，大小写无关：TRACE, DEBUG, INFO, WARN, ERROR, ALL 和 OFF，还有一个特俗值INHERITED或者同义词NULL，
  代表强制执行上级的级别。如果未设置此属性，那么当前logger将会继承上级的级别。
- addtivity:是否向上级logger传递打印信息。默认是true。

~~~
<logger>用来设置某一个包或者具体的某一个类的日志打印级别、以及指定<appender>。
<logger>仅有一个name属性，一个可选的level和一个可选的addtivity属性
~~~

#### 用法

- 1.带有logger的配置，不指定级别，不指定appender，logback-spring.xml增加 logger 配置如下：

~~~xml
<!--控制com.taotao.pethouse.app.controller包下的所有类的日志的打印，-->
<!--        没有设置打印级别，所以继承他的上级的日志级别“info”；-->
<!--        没有设置addtivity，默认为true，将此loger的打印信息向上级传递；-->
<!--        没有设置appender，此loger本身不打印任何信息。-->
<logger name="com.taotao.pethouse.app.controller"/>
        <!--将级别为“info”及大于“info”的日志信息传递给root，本身并不打印-->
        <!-- root接到下级传递的信息，交给已经配置好的名为“console”的appender处理，“console” appender 将信息打印到控制台-->
~~~

- 2.带有多个logger的配置，指定级别，指定appender

~~~xml
<!--控制com.taotao.pethouse.app.controller类的日志打印，打印级别为“WARN”;-->
<!--additivity属性为false，表示此loger的打印信息不再向上级传递;-->
<!--指定了名字为“console”的appender-->
<logger name="com.taotao.pethouse.app.controller" level="WARN" additivity="false">
    <appender-ref ref="console"/>
</logger>
        <!--级别为“WARN”及大于“WARN”的日志信息交给此logger指定的名为“console”的appender处理，在控制台中打出日志，不再向上级root传递打印信息-->
~~~

### 多环境日志输出

1.logback-spring.xml增加springProfile标签配置

~~~xml

<configuration>
    <!--    ...-->
    <!--application.yml 传递参数，不能使用logback 自带的<property>标签 -->
    <springProperty scope="context" name="appname" source="logback.appname"/>
    <springProperty scope="context" name="logdir" source="logback.logdir"/>

    <contextName>${appname}</contextName>

    <!--输出到控制台 ConsoleAppender-->
    <appender name="console" class="ch.qos.logback.core.ConsoleAppender">
        <!--展示格式 layout-->
        <layout class="ch.qos.logback.classic.PatternLayout">
            <pattern>
                <pattern>%d{HH:mm:ss.SSS} %contextName [%thread] %-5level %logger{36} - %msg%n</pattern>
            </pattern>
        </layout>
    </appender>

    <!-- 测试环境+开发环境. 多个使用逗号隔开. -->
    <springProfile name="test,dev">
        <logger name="com.taotao.pethouse.app.controller" level="DEBUG" additivity="false">
            <appender-ref ref="console"/>
        </logger>
    </springProfile>

    <!-- 生产环境. -->
    <springProfile name="prod">
        <logger name="com.taotao.pethouse.app.controller" level="INFO" additivity="false">
            <appender-ref ref="console"/>
        </logger>
    </springProfile>
</configuration>
~~~

2.application.yml增加环境选择的配置active: dev；自定义日志路径

~~~yaml
spring:
  profiles:
    active: dev
logback:
  logdir: ./server/log
  appname: pethouse
~~~


> 参考：[https://blog.csdn.net/inke88/article/details/75007649#comments?utm_source=tuicool&utm_medium=referral](https://blog.csdn.net/inke88/article/details/75007649#comments?utm_source=tuicool&utm_medium=referral)
