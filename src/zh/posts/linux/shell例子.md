16.动态进度指针

```shell
rotate_line(){
INTERVAL=0.5  #设置间隔时间
COUNT="0"     #设置4个形状的编号,默认编号为 0(不代表任何图像)
while :
do
  COUNT=`expr $COUNT + 1` #执行循环,COUNT 每次循环加 1,(分别代表4种不同的形状)
  case $COUNT in          #判断 COUNT 的值,值不一样显示的形状就不一样
  "1")                    #值为 1 显示‐
          echo -e '-'"\b\c"
          sleep $INTERVAL
          ;;
  "2")                  #值为 2 显示\\,第一个\是转义
          echo -e '\\'"\b\c"
          sleep $INTERVAL
          ;;
  "3")                  #值为 3 显示|
          echo -e "|\b\c"
          sleep $INTERVAL
          ;;
  "4")                   #值为 4 显示/
          echo -e "/\b\c"
          sleep $INTERVAL
          ;;
  *)                    #值为其他时,将 COUNT 重置为 0
          COUNT="0";;
  esac
done
}
rotate_line
```

17.99 乘法表

```shell
for i in `seq 9`;do for j in `seq $i`;do echo "$j*$i=$[i*j]";done;done
```

18.字符串分割成数组

```shell
#!/bin/bash

function split_1()
{
    x="a,b,c,d"

    OLD_IFS="$IFS"
    IFS=","
    array=($x)
    IFS="$OLD_IFS"

    for each in ${array[*]}
    do
        echo $each
    done
}

function split_2()
{
    x="a,b,c,d"

    echo $x | awk '{split($0,arr,",");for(i in arr) print i,arr[i]}'
}

split_1
split_2
```
