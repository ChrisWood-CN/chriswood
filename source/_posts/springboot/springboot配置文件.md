---
title: springboot配置文件
date: 2022-10-08 15:55:43
categories: springboot
tags: springboot
---
##springboot配置文件
在springboot 项目中一般默认的配置文件是application.properties,但是实际项目中我们一般会使用application.yml文件
### yml文件读取顺序
#### 存放目录
SpringBoot配置文件默认可以放到以下目录中，可以自动读取到：
- 项目根目录中config目录下
- 项目根目录下
- 项目resources目录中config目录下
- 项目的resources目录下
#### 读取顺序
在不同的目录中存在多个配置文件，它的读取顺序是：
1、config/application.properties（项目根目录中config目录下）
2、config/application.yml
3、application.properties（项目根目录下）
4、application.yml
5、resources/config/application.properties（项目resources目录中config目录下）
6、resources/config/application.yml
7、resources/application.properties（项目的resources目录下）
8、resources/application.yml
>注意：1、如果同一个目录下，有application.yml也有application.properties，默认先读取application.properties。
>2、如果同一个配置属性，在多个配置文件都配置了，默认使用第1个读取到的，后面读取的不覆盖前面读取到的。
>3、创建SpringBoot项目时，一般的配置文件放置在“项目的resources目录下
### yml文件读取方式
#### yml文件规则
- yml文件的好处，天然的树状结构，一目了然，实质上跟properties是差不多
- 不支持tab缩进
- 可以使用 "-小写字母" 或 "_小写字母"来 代替 "大写字母",如 userName 与 user-name ,user_name 含义是一样的,key: value 格式书写
  key,后面跟着冒号,再后面跟着一个空格,然后是值 
#### 几种数据格式的表示方式

##### 1.普通的值（数字，字符串，布尔）

key: value ,如:
```yaml
age: 18
name: zhangsan
```
>注意：字符串默认不用加上单引号或者双引号；
""：双引号不会转义字符串里面的特殊字符；特殊字符会作为本身想表示的意思
name: "zhangsan \n lisi"：输出；zhangsan 换行 lisi
''：单引号会转义特殊字符，特殊字符最终只是一个普通的字符串数据
name: ‘zhangsan \n lisi’：输出；zhangsan \n lisi

##### 2.对象、Map（属性和值）（键值对）
```yaml
person:
    age: 18
    name: mysgk
map:  
  name: 刘德华  
  age: 10
```
##### 3.数组（List、Set）
```yaml
hands:
    - left
    - right
list: 列表1,列表2,列表3
set: [集合1,集合2,集合3]
```
#### 读取配置的方式
##### 1.@Value
直接在对应的变量上添加@Value注解即可，此时配置的key可以不与变量名相同
```yaml
server:
  port: 8081
```
```java
@Value("${server.port}")
public String serverPort;
```
##### 2.@ConfigurationProperties
新增一个Student类，同时添加@ConfigurationProperties注解
```yaml
student:  
  name: 刘德华  
  age: 40
```
```java
@Data
@ConfigurationProperties(prefix = "student")
public class Student {    
    String name;    
    int age;
}
```
##### 3.@Environment
用的很少，了解即可
```yaml
test:
    msg: aaa
```
```java
@Autowired
private Environment env

public static void main() {
    System.out.println(env.getProperty("test.msg"));
}
```
