---
title: shell脚本编辑
categories: shell
tags:
  - shell
date: 2023-06-09 14:44:00
---

## shell 脚本语法
#### 1.demo.sh
~~~shell
#!/bin/bash
echo hello world!
~~~
给shell脚本可运行权限
~~~shell
chmod +x demo.sh
~~~
#### 2.read命令
~~~shell
#!/bin/bash
echo "please input name and your age："
read name age
echo "your name:" $name ",your age: $age"	# shell 脚本输出变量：$变量名
~~~
#### 3、数值计算
shell 仅支持整型，数值计算使用$((表达式))
~~~shell
#!/bin/bash
read -p "please input operand and number: " operand number #-p 后面跟提示信息，即在输入前打印提示信息	
echo "$operand + $number = $(($operand+$number))"
echo "$operand - $number = $(($operand - $number))"
echo "$operand * $number = $(($operand * $number))"
divided=$(($operand/$number))		#赋值等号间不能有空格!
echo "$operand / $number = $divided"
~~~
#### 4.test命令
~~~shell
cmd1 && cmd2
#当 cmd1 执行完毕且正确，那么 cmd2 执行，当 cmd1 执行完毕且错误，那么 cmd2 不执行
cmd1 || cmd2
#当 cmd1 执行完毕且正确，那么 cmd2 不执行，当 cmd1 执行完毕且错误，那么 cmd2 执行
~~~
test命令用于查看文件是否存在、权限等信息，可以进行数值、字符和文件三方面的测试
~~~shell
#!/bin/bash
read -p "please input first string: " firstStr
read -p "please input second string: " secondStr
test $firstStr = $secondStr && echo "The two strings are the same" || echo "The two strings are not the same"
# test str1 = str2 ：两个字符串相等则为真
~~~
#### 5、中括号判断符
~~~shell
#!/bin/bash
read -p "please input first string: " firstStr
read -p "please input second string: " secondStr
[ "$firstStr" == "$secondStr" ] && echo "The two strings are the same" || echo "The two strings are not the same"
# 中括号两端内测要加空格，内容建议加 ""，否则有空格时会出现参数过多
[ "$firstStr" != "$secondStr" ] && echo "The two strings are not the same" || echo "The two strings are the same"
[ "$firstStr" = "$secondStr" ] && echo "The two strings are the same" || echo "The two strings are not the same"
echo firstStr:  $firstStr
echo secondStr: $secondStr
~~~
#### 6、默认变量
$0 ~ $n，表示 shell 脚本的执行参数，包括 shell 脚本执行命令本身，shell 脚本执行命令本身为$0。
$#表示最后一个参数的标号，$@表示除$0外的所有参数
~~~shell
#!/bin/bash
echo "The zero parameter  ："$0
echo "The first parameter ："$1
echo "The second parameter："$2
echo "The label of the last parameter："$#
echo "All parameters      ："$@
~~~
~~~shell
./demo.sh 001 002
# The zero parameter ./demo.sh
# The first parameter 001
# The second parameter 002
# The label of the last parameter： 2
# All parameters 001 002
~~~
#### 7、条件判断
~~~shell
if 条件判断;then
	# 判断成立后要执行的语句
fi				# 结束语句


if 条件判断; then
	# 条件判断后成立要执行的语句
else
	# 条件判断后不成立要执行的语句
fi


if 条件判断; then
	# 条件判断后成立要执行的语句
elif 条件判断;then		# 此语句可多次添加
	# 条件判断后成立要执行的语句
else
	# 条件判断后不成立要执行的语句
fi


case $变量 in		# 与 C语言 switch case 相似
"第一个变量内容")
	# 程序段
	;;		# 表示第一个程序块结束
"第二个变量内容")
	# 程序段
	;;		# 表示第二个程序块结束
"第n个变量内容")
	# 程序段
	;;		# 表示第 n个程序块结束
*)			# 类似 C语言 switch case的 default
	# 程序段
	;;
esac
~~~
~~~shell
#!/bin/bash
read -p "please input(Y/N):" value

if [ "$value" == "Y"  ] || [  "$value" == "y" ]; then
        echo "your input is Y"
        exit 0
fi

if [ "$value" == "N"  ] || [  "$value" == "n" ]; then
        echo "your input is N"
        exit 0
fi
~~~
#### 8、函数
~~~shell
function fname(){		# function 可写可不写
	# 函数代码段
}
fname		# 函数调用
fname param1 param2		# 函数传参
~~~
#### 9、循环
~~~shell
while 条件			# 条件状态为判断式，条件成立时循环，直到条件不成立
do					# 循环开始
	# 循环代码段
done

until 条件			# 条件状态为判断式，条件不成立时循环，直到条件成立
do					# 循环开始
	# 循环代码段
done

for var in con1 con2 con3 ......
do
	# 循环代码段
done
# 变量 var 循环变化，第一次循环等于 con1，第二次循环等于 con2，以此类推


for((初始值;限制值;执行步长))
do
	# 循环代码段
done
# 用法类似于 C语言 for循环
~~~
#### 10、一般写法
~~~shell
# 获取PID
PID=`ps -ef |grep java|grep app|grep -v grep|awk '{print $2}'`
kill -TERM $PID
~~~
