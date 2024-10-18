---
title: awk & sed & grep
date: 2024-10-17 13:09:22
categories: Linux
tags:
  - awk & sed & grep
  - Linux
---

# awk

## awk 语法格式

awk 主要是用来格式化

```
awk [参数] [处理内容] [操作对象]

print	: 打印
NF		: 统计总字段数
$		: 取值
结合作用:
	$配合NF使用: NF内存储统计文件内每行的总字段，$存储NF内的值
	NF:相当于 变量值
  $:相当于 变量名
	print相当于打印 $ 内的内容
  -F: 指定文本分隔符 (本身默认是以空格作为分隔符)
```

## awk 生命周期

grep,sed 和 awk 都是读一行处理一行，直到处理完成

接收一行作为输入；把刚刚读入进来得到文本进行分解；使用处理规则处理文本；输入一行，赋值给$0，直至处理完成；把处理完成之后的所有数据交给 END{}来再次处理

## awk 中的预定义变量

```shell
# $0 : 代表当前行(相当于匹配所有)
awk -F: '{print $0, "---"}' /etc/passwd

$n : 代表第 n 列
# 案例 1:(以:为分隔符)
awk -F: '{print $1}' /etc/passwd
# 案例 2:(默认空格为分隔符)
awk '{print $1}' /etc/passwd

# NF : 记录当前统计总字段数
# 案例 1:(以:为分隔符 统计文件内每行内的行数)
awk -F: '{print NF}' /etc/passwd
# 案例 2:(以:为分隔符 统计文件内每行总字段 并打印每行统计行数)
awk -F: '{print $NF}' /etc/passwd

# NR : 用来记录行号
# 案例 1:
awk -F: '{print NR}' /etc/passwd

# FS : 指定文本内容分隔符(默认是空格)
# 案例 1:
awk 'BEGIN{FS=":"}{print $NF, $1}' /etc/passwd
# FS 的优先级要高于 -F
# 解析:
# BEGIN{FS=":"} : 相当于指定以 : 为分隔符
# $NF : 存储以 : 分隔符的最后一列
# $1 : 存储以 : 分隔符的第一列
# print : 打印

# OFS : 指定打印分隔符(默认空格)
# 案例 1:(输出的意思 分隔符会打印出来)
awk -F: 'BEGIN{OFS=" >>> "}{print $NF, $1}' /etc/passwd
# 解析:
# BEGIN{OFS=" >>> "} : 指定打印分隔符
# $NF : 存储以 >>> 分隔符的最后一列
# $1 : 存储以 >>> 分隔符的第一列
# print : 打印
```

## awk 运行处理规则的执行流程

最少有 1 个，最多有 4 个

1. BEGIN{} : 最开始执行
2. // : 正则
3. {} : 循环体
4. END{} : 最后执行

## awk 中的函数

```shell
# print	: 打印
# printf	: 格式化打印
# %s		: 字符串
# %d		: 数字
# -		: 左对齐
# +		: 右对齐
# 15		: 至少占用15字符


# awk中函数(格式化打印)
# 案例1:
awk -F: 'BEGIN{OFS=" | "}{printf "|%+15s|%-15s|\n", $NF, $1}' /etc/passwd

# 解析:
# |		: 以 | 为分隔符
# |%+15s|	 : 以 | 为分隔符 %s 配合 printf 使用 代替当前字符串 右对齐 占用15字符
# |%-15s|	 : 以 | 为分隔符 %s 配合 printf 使用 代替当前字符串 左对齐 占用15字符
# \n		 : 换行符
# $NF		 : 存储以 | 为分隔符的最后一列
# $1		 : 存储以 | 为分隔符的第一列

```

## awk 中的正则表达式

```shell
# 案例1:(awk中匹配有root内容的行)
	awk -F: '/root/{print $0}' /etc/passwd
# 解析:
# 	/root/{print $0}	: awk中先执行正则 在执行循环 匹配文件内有root的每一行。
	       $0			:代表所有
# 案例2:(awk中匹配root开头的行)
	awk -F '/^root/{print $0}' /etc/passwd

```

## awk 中的比较表达式

```shell
# >		: 小于
# <		: 大于
# >=		: 小于等于
# <=		: 大于等于
# ~		: 正则匹配(包含)
# !~		: 正则匹配(不包含)


# 案例1:
# 	要求打印属组ID大于属主ID的行
	awk -F: '$4 > $3{print $0}' /etc/passwd
# 解析:
# 	$4	: 代表属组所在列
# 	$3	: 代表属主所在列
# 	$0	: 所有行

# 案例2:
# 	打印结尾包含bash
	awk -F: '$NF ~ /bash/{print $0}' /etc/passwd
# 解析:
# 	$NF ~ /bash/	:尾部最后一列 包含 bash 的行
# 		~		   : 包含

# a案例3:
# 	打印结尾不包含bash
	awk -F '$NF !~ /bash/{print $0}' /etc/passwd
# 解析:
# 	!~	: 不包含 (将打印其他内容)

```

## awk 中的条件表达式

```shell
# ==
# >
# <
# >=
# <=

# 要求打印第三行
# 案例1:
	awk -F: 'NR == 3{print $0}' /etc/passwd
# 解析:
# 	NR  : 行号
#   NR == 3  : 行号等于3
```

## awk 中的逻辑表达式

```shell
# &&		: 逻辑与
# ||		: 逻辑或
# ！       : 逻辑非

# 案例1:(与(两者条件必须都成立))
	awk -F: '$3 + $4 > 2000 && $3 * $4 > 2000{print $0}' /etc/passwd

# 案例2:(或(两者条件一个成立即可))
	awk -F: '$3 + $4 > 2000 || $3 * $4 > 2000{print $0}' /etc/passwd

# 案例3:(非(条件取反))
	awk -F: '!($3 + $4 > 2000){print $0}' /etc/passwd
```

## awk 中的算术表达式

```shell
# +	:加
# -	:减
# *	:乘
# /	:除
# %	:求余


# 1.要求匹配打印出属组 + 属主的ID 大于 2000 的
# 案例1:
	awk -F: '$3 + $4 > 2000{print $0}' /etc/passwd

# 2.要求属组 * 属主的ID 大于 2000
# 案例2:
	awk -F: '$3 * $4 > 2000{print $0}' /etc/passwd

# 3.要求打印偶数行
# 案例3:
	awk -F: 'NR % 2 == 0{print $0}' /etc/passwd
# 解析:
# 	NR  :全部行号 除以 2 == 零的 零等于余数
```

## awk 流程控制

```shell
# 流程控制只存在循环之中

# if:
	awk -F: '{if($3>$4){print "大于"}else{print "小于或等于"}}' /etc/passwd
# 解析:
# 	判断文件 第三列大于第四列的话打印(大于) 不大于 else

# if 使用格式:
# if(){}				   : 单分支
# if(){}else{} 		   : 双分支
# if(){}else if(){}else{}	: 多分支


# for每一行打印10次
# for 使用格式
	awk -F: '{for(i=10;i>0;i--){print $0}}' /etc/passwd
# 解析:
# 	i-- 相当于python中的 i-=1   : i=i-1
# 	减到条件不成立为止
# 	格式:
# 	fro(i="初始值":条件判断:游标){}

# while每一行打印10次
# while 使用格式
	awk -F: '{i=1; while(i<10){print $0, i++}}' /etc/passwd
# 解析:
# 	i++ 相当于python中的 i+=1
# 	加到条件不成立为止
# 	格式:
# 	while(条件判断){}
```

# sed

## sed 语法格式

sed 是 shell 编程中的一个流式文本编辑器，用于对文本进行转换、替换和处理

```
sed [选项] '编辑命令' 文件

选项
-e <命令>:指定一个或多个编辑命令。
-f <脚本文件>:从指定的脚本文件中读取编辑命令。
-i:直接在原始文件上进行修改（在某些版本中可能需要指定备份文件的扩展名）。
-n:禁止自动打印模式空间内容。
-r:启用扩展的正则表达式语法（在某些版本中使用-E选项）。

编辑命令
s/模式/替换/:替换模式匹配的文本。
n:打印模式空间的内容。
d:删除模式空间的内容。
p:打印模式空间的内容。
i\文本:在当前行之前插入文本。
a\文本:在当前行之后追加文本。
c\文本:用新文本替换匹配行。
r 文件:将文件的内容插入到当前行之后。
w 文件:将模式空间的内容写入文件
```

## sed 的 p 命令

```shell
# 显示第5行
sed -n '5p' /etc/passwd
# 显示第1行和第5行
sed -n '1p;5p' /etc/passwd
# 显示1到5行
sed -n '1,5p' /etc/passwd
# 取反 显示1-4行
sed -n '5,$!p' /etc/passwd
# 显示第2行和其后面两行
sed -n '2,+2p' /etc/passwd
# 打印最后一行
sed -n '$p' /etc/passwd
# 从第一行起，每间隔3行输出一行
sed -n '1~3p' /etc/passwd
```

## sed 的 s 命令

```shell
# 在2到10行前面加上注释
sed -n '2,10s/^/#/p' passwd
# 在每行末尾加上？
sed -n 's/$/?/p' passwd
#  将/etc/selinux/config的SELINUX参数改为disabled
sed -n '/^SELINUX=/ s|enforcing|disabled|p' /etc/selinux/config

# sed的s命令可以使用任意分隔符作为定界符
# 以/作为分隔符
sed -n '/^hello/s/\/bin\/bash/\/sbin\/nologin/p' /etc/passwd
# 以|作为分隔符
sed -n '/^hello/s|/bin/bash|/sbin/nologin|p' /etc/passwd
# 以：作为分隔符
sed -n '/^hello/s:/bin/bash:/sbin/nologin:p' /etc/passwd

# sed的s命令中支持\t \n
sed -n 's/^xixi/\n1111111111111111/p' /etc/passwd
sed -n 's/^xixi/\t1111111111111111/p' /etc/passwd
sed 's/^abrt.*/&\n/' passwd
```

## sed 的 c 命令

```shell
# 更改整行操作可以根据行号和模式匹配进行操作
# 将id：所在的行整行替换成后面的字符串
sed '/id:/c id:5:initdefault:' /etc/inittab
# 将第3行改成后面的字符串
sed '3c ONBOOOT=no' ifcfg-eth0
```

## sed 的 r 命令

```shell
# 读入操作可以根据行号和模式匹配进行操作
# 在fstab文件的末尾后面读入hosts文件的内容
sed '$r /etc/hosts' /etc/fatab
df -h |sed '/dev/sda1/r /etc/mtab'

# file里的内容被读进来，显示在与test匹配的行后面，如果匹配多行，则file的内容将显示在所有匹配行的下面
sed '/test/r file' filename
```

## sed 的 w 命令

```shell
# 在example中所有包含test的行都被写入file里
sed -n '/test/w file' example
```

## sed 的 a 命令

```shell
# 追加操作可以根据行号和模式匹配进行操作
# 在第一行下新起一行追加后面的字符串
sed '1a aaaaaaaaaaaa' /etc/fstab
# 在包含boot的行下面追加后面的字符串
sed '/boot/a aaaaaaaaaa' /etc/fstab
```

## sed 的 i 命令

```shell
# 插入操作可以根据行号和模式匹配进行操作
# 在最后一行的前面插入后面的字符串
sed '$i 1111111111111' /etc/fstab
# 在包含defaults的行前面插入后面的字符串
sed '/defaults/i 1111111111111' /etc/fstab
```

## sed 的 d 命令

```shell
# 删除操作可以根据行号和模式匹配进行操作

# 删除第3到5行
sed '3,5d' /etc/fstab
# 删除包含2的行
sed '/2/d' /etc/fstab
# 除了包含ext3的行都删
sed '/ext3/!d' /etc/fstab
# 删除空行和注释
sed -r '/^$|^#/d' /etc/inittab
sed -e '/^$/d'  -e '/^#/d' /etc/inittab
sed -r '/^$/d;/^#/d' /etc/inittab
```

## sed 中的&用法

```shell
# &用于表示替换命令中的匹配模式
echo 'I have a fat cat' | sed 's/.at/".at"/g'
# I have a ".at" ".at"
echo 'I have a fat cat' | sed 's/.at/"&"/g'
# I have a "fat" "cat"

#  在所有三位数字后面加个0
sed -nr 's/\<[0-9]{3}\>/&0/gp' /etc/passwd
```

## sed 中的命令标签用法

```shell
# 标签：sed使用圆括号定义替换模式中的部分字符；相当于正则分组
# 标签可以方便在后面引用，每行指令最多添加9个指令，相当于python里的引用分组

# 例如：
sed -r 's/(^[[:alnum:]]+)(.*)/\1/' /etc/passwd
sed -r 's/(^[[:alnum:]]+)(.*)/\2/' /etc/passwd

echo aaa bbb ccc | sed -r 's/([a-z]+)([a-z]+)([a-z]+)/\3 \2 \1/'
```

## sed 模式空间（pattern space）和保持空间（hold space）相关的命令

n 输出模式空间行，读取下一行替换当前模式空间的行，执行下一条处理命令而非第一条命令。
N 读入下一行，追加到模式空间行后面，此时模式空间有两行。
h 把模式空间里的行拷贝到暂存空间。
H 把模式空间里的行追加到暂存空间。
g 用暂存空间的内容替换模式空间的行。
G 把暂存空间的内容追加到模式空间的行后。
x 将暂存空间的内容于模式空间里的当前行互换。
！对所选行以外的所有行应用命令。
d 删除模式空间的内容并导致读入新的输入行，从而在脚本的顶端重新使用编辑方法
D 删除模式空间中直到第一个嵌入的换行符的这部分内容。它不会导致读入新的输入行，相反，它返回到脚本的顶端，将这些指令应用于模式空间剩余的内容

## sed 执行流程

sed 编辑器逐行处理文件，并将输出结果打印到屏幕上。sed 命令将当前处理的行读入模式空间（pattern space）进行处理，sed 在该行上执行完所有命令后就将处理好的行打印到屏幕上（除非之前的命令删除了该行），sed 处理完一行就将其从模式空间中删除，然后将下一行读入模式空间，进行处理、显示。处理完文件的最后一行，sed 便结束运行。sed 在临时缓冲区（模式空间）对文件进行处理，所以不会修改原文件，除非显示指明 -i 选项

## sed 示例

```shell
# 替换文本
sed -i "s|^dataDir=.*|dataDir=${installDir}/zookeeper-${version}/zk_snapshot|" "${installDir}/zookeeper-${version}/conf/zoo.cfg"
# 解析：
# -i: 是sed命令的选项之一，表示直接修改文件内容，而不是输出到标准输出。
# ^dataDir=: 正则表达式中的^表示行的开头，dataDir=表示匹配以dataDir=开头的行。
# .*: 表示匹配任意字符（除了换行符）的任意次数。
# dataDir=${installDir}/zookeeper-${version}/zk_snapshot: 是替换后的内容。
# "${installDir}/zookeeper-${version}/conf/zoo.cfg": 这是要进行替换操作的文件路径。

# 删除匹配行
sed '/pattern/d' file.txt
# 解析：
# /pattern/: 正则表达式模式，用于匹配文件中的行。可以根据需要替换为具体的模式。
# d: d表示删除匹配到的行。
# file.txt: 这是要进行操作的文件路径。

# 打印特定行
sed -n '5p' file.txt
# 解析：
# -n: 是sed命令的选项之一，表示只输出经过处理的行，而不是全部输出。
# '5p': 这是sed命令的打印操作部分。它使用了数字5来指定要打印的行号，并使用p表示打印该行。
# file.txt: 这是要进行操作的文件路径。

# 在指定行之前插入文本
sed '3i\Insert this line' file.txt
# 解析：
# '3i\Insert this line': 这是sed命令的插入操作部分。它使用了3来指定要插入的行号，并使用i表示插入操作。
# \Insert this line是要插入的文本内容，\用于转义特殊字符。
# file.txt: 这是要进行操作的文件路径。

# 从文件中读取编辑命令
sed -f script.sed file.txt
# 解析：
# -f: 这是sed命令的选项，用于指定要执行的脚本文件。
# script.sed是包含了多个sed操作的脚本文件的路径。
# file.txt: 这是要进行操作的文件路径。

# 使用sed命令在core-site.xml文件中的</configuration>标签之前添加新内容
sed -i '/<\/configuration>/i '"$new_content"'' /opt/module/hadoop-3.1.3/etc/hadoop/core-site.xml
# 解析：
# -i: 这是sed命令的选项，表示直接修改原始文件，而不是将结果输出到标准输出。
# '/<\/configuration>/i '"$new_content"'': 这是sed命令的插入操作部分。/<\/configuration>/是一个正则表达式，用于匹配文件中的标签。i表示插入操作。"$new_content"是一个变量，用于指定要插入的新内容。
# /opt/module/hadoop-3.1.3/etc/hadoop/core-site.xml: 这是要进行操作的文件路径。

# 使用sed命令替换core-site.xml文件中的<configuration></configuration>标签之间的内容
sed -i '/<configuration>/,/<\/configuration>/c '"$new_content"'' /opt/module/hadoop-3.1.3/etc/hadoop/core-site.xml
# 解析：
# -i: 这是sed命令的选项，表示直接修改原始文件，而不是将结果输出到标准输出。
# '/<configuration>/,/<\/configuration>/c '"$new_content"'': 这是sed命令的替换操作部分。/<configuration>/,/<\/configuration>/是一个范围地址，用于匹配文件中位于和之间的内容。c表示替换操作。"$new_content"是一个变量，用于指定要替换的新内容。
# /opt/module/hadoop-3.1.3/etc/hadoop/core-site.xml: 这是要进行操作的文件路径。
```
