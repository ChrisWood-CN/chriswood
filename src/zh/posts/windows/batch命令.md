---
title: batch命令 
date: 2023-05-25 16:49:26 
categories: batch 
tags:
- windows
- batch
---

### echo & @

回显命令：命令行中要不要显示在bat脚本中输入的语句

- @ 关闭单行回显
- echo off 从下一行开始关闭回显
- @echo off 从本行开始关闭回显（一般的脚本都以这个开头）
- echo on 从下一行开始打开回显
- echo 显示当前是echo off 还是echo on
- echo.输出一个 “回车换行”，空白行

### errorlevel

~~~shell
# 输出errorlevel
echo %errorlevel%
# 返回 0 ：正常；1：出现错误
~~~
~~~shell
if errorlevel == 0 goto do
if errorlevel == -1 goto wait

:do #...正确之后需要做的代码
:wait #...错误需要做的代码
pause 
goto start #执行错误代码之后  再次循环到 需要判断errorlevel的代码之处重新运行
#（确定设备 是否连接成功，如果设备未连接 或者连接过多 就会报出 -1 的错误 这样就可以确定）
~~~
### dir 显示文件的内容
~~~shell
dir #显示当前目录中的文件和子目录
dir /a #显示当前目录中的文件和子目录，包括隐藏文件和系统文件
dir /a:d #显示C盘当前目录中的目录
dir /a:-d #显示C盘根目录中的文件
dir /b/p #/b只显示文件名，/p分页显示
dir *.exe /s #显示当前目录和子目录里所有的.exe文件
~~~
### cd 切换目录
### md 创建目录
~~~shell
md c:abc #如果c盘下没有adc这个一目录，那么将会自动创建中级目录
cd c:
md \a\b\c #会在当前目录下的根目录下创建逐级创建 a b c三个目录（例如现在在c:/scripts下 那么 在这里执行bat脚本 会在c盘下直接创建）
~~~
### rd 删除目录
~~~shell
rd adc
rd /s/q d:temp #删除d:temp文件夹以及其子文件夹和文件，/q安静模式
~~~
### del 删除文件
~~~shell
del d:test.txt #删除指定文件，不能隐藏，系统，只读文件
del /q/a/f d:temp*.* #删除d:temp文件夹里面的所有文件，包括隐藏，只读，系统文件，不包括子目录
del /q/a/f/s d:temp*.* #删除d:temp及子文件夹里面的所有文件，包括隐藏，只读，系统文件，不包括子目录
~~~
### ren 重命名命令
~~~shell
ren d:temp tmp
ren e:test.txt tttt.txt
~~~
### cls 清屏
### type 显示文件内容
~~~shell
type c:boot.ini #显示指定文件的内容，程序文件一般会显示乱码
type *.txt #显示当前目录里所有的.txt文件的内容（以文件名+内容的形式显示）
~~~
### copy 拷贝文件
~~~shell
copy c:test.txt d:text.txt
copy tttt.txt e:\BAT_scripts\sdk\t1.txt
#复制 tttt.txt 文件到e:\BAT_scripts\sdk\文件下并重命名为t1.txt
copy con test.txt #从屏幕上输入等待，用户输入的内容存入到 test.txt中（如果内有这个文件则新建）
#con代表屏幕，prn 代表打印机，nul代表空设备
copy test1.txt + test2.txt test3.txt
#合并test1.txt 和test2.txt 为test3.txt 但是如果不指定test3.txt 那么则直接合并为第一个参数 也是就是test1.txt
copy test.txt +
#复制文件到自己， 就是修改文件的时间
~~~
### title name 设置cmd窗口的标题
### ver 显示系统版本
### label & vol 设置卷标
~~~
vol 显示卷标
label 显示卷标 同时提示输入新卷标
label c:system 设置c盘的卷标为system
~~~
### pause 暂停命令
### rem & ::注释命令 被注释的行不执行操作
### date & time 日期和时间
~~~shell
date/t #只显示当前日期，不提示输入新日期
time/t #只显示当前时间，不提示输入新时间
~~~
### goto 和 :跳转命令
~~~shell
:starter #行首为 :表示改行是标签行，标签行不执行操作
goto starter #跳转到指定的标签那一行
~~~
### find （外部命令） 查找命令
~~~shell
find "abc" c:text.txt
#在c:text.txt 文件里查找包含abc字符串的行
#如果找不到，将设errorlevel返回码为1
find /i "abc" c:text.txt
#查找含有abc的行，忽略大小写
find /c "abc" c:text.txt
#显示含有abc 的行的行数
~~~
### more （外部命令）逐屏显示
~~~shell
more c:text.txt
#逐屏显示c:text.txt 的文件内容
~~~
### tree 显示目录结构
~~~shell
tree d: #显示d盘的文件目录结构
~~~
### & 顺序执行多条命令，而不管命令是否执行成功
### && 顺序执行多条命令，当碰到执行出错的命令后将不执行后面的命令
### || 顺序执行多条命令，当碰到执行正确的命令后将不执行后面的命令
### | 管道命令
~~~shell
dir *.* /s/a | find /c ".exe"
#管道命令表示先执行 dir 命令，对输出的结果执行后面的find命令该命令行结果：输出当前文件夹以及所有子文件夹里的.exe 文件的个数
type c:text.txt | more
#这个是 more c:text.txt的效果一样
~~~
### > 和 >> 输出重定向命令
~~~shell
> #清除文件中原有的内容后在写入
>> #追加内容到文件末尾，而不会清除原有的内容
#主要将本来显示在屏幕上的内容输出到指定文件中，指定文件如果不存在，则自动生成该文件
type c:test.txt > prn
#屏幕上不显示文件内容，专项输出到打印机
echo hello world > con
#在屏幕上显示 hello world ，实际上所有输出都是默认 > con的
copy c:test.txt f: >nul
#拷贝文件，并且不显示“文件复制成功”的提水信息，但如果f盘不存在，还是会显示出错信息
copy c:test.txt f: >nul 2>nul
#不显示“文件复制成功”的提示信息，并且f盘不存在的话，也不提示错误提示信息
echo ^^W ^> ^W>c:test.txt
#生成的文件内容为 ^W > W
#^ 和 > 是控制命令，要把他们输出到文件，必须在前面加个 ^ 符号
~~~
### < 从文件中获得输入信息，而不是从屏幕上
~~~shell
@echo off
echo 2005#01#01 > temp.txt
date < temp.txt 
del temp.txt
#这样就可以不等待输入直接修改当前日期
~~~
### %0 %1 %2 %3 %4 %5 %6 %7 %8 %9 %*
~~~shell
#命令行传递给批处理的参数
%0 #批处理文件本身
%1 #第一个参数
%9 #第九个参数
%* #从第一个参数开始的所有参数
#批参数(%n)的替代已被增强。您可以使用以下语法:
%~1 # 删除引号(" )， 扩充 %1
%~f1 # 将 %1 扩充到一个完全合格的路径名
%~d1 # 仅将 %1 扩充到一个驱动器号
%~p1 # 仅将 %1 扩充到一个路径
%~n1 # 仅将 %1 扩充到一个文件名
%~x1 # 仅将 %1 扩充到一个文件扩展名
%~s1 # 扩充的路径指含有短名
%~a1 # 将 %1 扩充到文件属性
%~t1 # 将 %1 扩充到文件的日期/时间
%~z1 # 将 %1 扩充到文件的大小
%~PATH:1 # 查找列在PATH环境变量的目录，并将%1扩充到找到的第一个完全合格的名称。
# 如果环境变量名未被定义，或者没有找到文件，此组合键会扩充到空字符串可以组合修定符来取得多重结果
%~dp1 #只将%1扩展到驱动器号和路径
%~nx1 #只将%1扩展到文件名和扩展名
%~dpPATH:1 #查找列在PATH环境变量的目录，并将扩充到找到的第一个完全合格的名称。
# 如果环境变量名未被定义，或者没有找到文件，此组合键会扩充到空字符串可以组合修定符来取得多重结果
%~ftza1 # 将 %1 扩展到类似 DIR 的输出行。
#可以参照 call/? 或 for/? 看出每个参数的含意
echo load “%%1” “%%2”>c:test.txt
#生成的文件内容为 load “%1” “%2”
#批处理文件里，用这个格式把命令行参数输出到文件
~~~
### if 判断命令
~~~shell
if "%1" == "/a" echo "第一个参数是/a"
if /i "%i" equ "/a" echo "第一个参数是/a"
/i #是不区分大小写
equ #和== 是一样的
if exist c:test.bat echo "存在c:test.txt文件"   

if not exist c:windows (
    echo "不存在c:windows文件夹"
)

if exist c:test.bat (
  echo "存在c:test.bat"
)else(
  echo "不存在c:test.bat"
)
#换行 最好是两个空格
~~~
### set 设置变量
~~~shell
#引用变量可在变量名前后加 % ，即 %变量名%
#set 显示目前所有的可用的变量，包括系统变量和自定义的变量
#echo %SystemDriver% 显示系统盘盘符，系统变量可以直接引用
#set p 显示所有以p开头的变量，要是一个也没有就设 errorlevel=1
set p=aa1bb1aa2bb2 #设置变量p，并赋值为=后面的字符串
echo %p% #显示变量p代表的字符串，即aa1bb1aa2bb2
echo %p:~6% #显示变量p中第6个字符以后的所有字符
echo %p:~6,3% #显示第6个字符以后的3个字符
echo %p:~0,3% #显示前三个字符
echo %p:-2% #显示最后面的两个字符
echo %p:0,-2% #显示除了最后两个字符的全部字符
echo %p:aa=c% #用c替换p中的所有的aa
echo %p:aa=% #将变量p中的所有aa字符串置换为空
echo %p:*bb=cc% #第一个bb以及其之前的所有字符被替换成cc
set p=%p:*bb=c% #设置变量p 为 %p:*bb=c%
set /a p=39 #设置p为数值型变量
set /a p=39/10 #支持运算符，有小数时用去尾法，39/10=3.9 去尾得3 ，p=3
set /a p=p/10 #用/a 参数时，在=后面的变量可以不用加%直接引用
set /a p="1&0" #“与”运算，要加引号
set p= #取消p变量
set /p #p=请输入
~~~
