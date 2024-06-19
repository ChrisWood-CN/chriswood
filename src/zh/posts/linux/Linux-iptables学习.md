---
title: Linux-iptables学习
categories: Linux
tags:
  - Linux
  - iptables
date: 2023-06-15 13:43:19
---

## iptables介绍
iptables组成Linux平台下的包过滤防火墙，与大多数的Linux软件一样，这个包过滤防火墙是免费的，在安装系统的时候就已经自带
## 基础概念
### 1.规则（rules）
规则（rules）其实就是网络管理员预定义的条件，规则一般的定义为“如果数据包头符合这样的条件，就这样处理这个数据包”。规则存
储在内核空间的信息 包过滤表中，这些规则分别指定了源地址、目的地址、传输协议（如TCP、UDP、ICMP）和服务类型（如HTTP、FTP
和SMTP）等。当数据包与规 则匹配时，iptables就根据规则所定义的方法来处理这些数据包，如放行（accept）、拒绝（reject）和
丢弃（drop）等。配置防火墙的 主要工作就是添加、修改和删除这些规则
~~~shell
iptables -L

#Chain INPUT (policy ACCEPT)
#target     prot opt source               destination    
#ACCEPT     all  --  anywhere             VM-4-11-centos/16     
#Chain FORWARD (policy ACCEPT)
#target     prot opt source               destination   
#ACCEPT     all  --  anywhere             VM-4-11-centos/16       
#Chain OUTPUT (policy ACCEPT)
#target     prot opt source               destination  
#ACCEPT     all  --  anywhere             anywhere
# 可以看出在 INPUT、FORWARD、OUTPUT着三条默认规则中都是accept，所有此时iptables没有对数据进行任何控制。

# 设置默认规则
#命令格式：iptables -P INPUT/FORWARD/OUTPUT 行为
iptables -P OUTPUT DROP
# 现在在output链上设置了默认规则，即所有从本机发出的数据包都会被丢掉
~~~
### 2.规则表和链
表（tables）提供特定的功能，iptables内置了4个表，即filter表、nat表、mangle表和raw表，分别用于实现包过滤，网络地址
转换、包重构(修改)和数据跟踪处理

链（chains）是数据包传播的路径，每一条链其实就是众多规则中的一个检查清单，每一条链中可以有一条或数条规则。当一个数据包
到达一个链时，iptables就会从链中第一条规则开始检查，看该数据包是否满足规则所定义的条件。如果满足，系统就会根据该条规则
所定义的方法处理该数据包；否则iptables将继续检查下一条规则，如果该数据包不符合链中任一条规则，iptables就会根据该链预
先定义的默认策略来处理数据包

Iptables采用“表”和“链”的分层结构。在RHEL5中是四张表五个链。下面罗列一下这四张表和五个链。注意一定要明白这些表和链的关
系及作用。
#### 1）规则表
##### filter表（默认）——三个链：INPUT、FORWARD、OUTPUT
作用：过滤数据包  内核模块：iptables_filter.
##### Nat表——三个链：PREROUTING、POSTROUTING、OUTPUT
作用：用于网络地址转换（IP、端口） 内核模块：iptable_nat
##### Mangle表——五个链：PREROUTING、POSTROUTING、INPUT、OUTPUT、FORWARD
作用：修改数据包的服务类型、TTL、并且可以配置路由实现QOS内核模块：iptable_mangle(设置策略时几乎不会用到它)
##### Raw表——两个链：OUTPUT、PREROUTING
作用：决定数据包是否被状态跟踪机制处理  内核模块：iptable_raw
#### （2）规则链
##### INPUT——进来的数据包应用此规则链中的策略
##### OUTPUT——外出的数据包应用此规则链中的策略
##### FORWARD——转发数据包时应用此规则链中的策略
##### PREROUTING——对数据包作路由选择前应用此链中的规则（记住！所有的数据包进来的时侯都先由这个链处理）
##### POSTROUTING——对数据包作路由选择后应用此链中的规则（所有的数据包出来的时侯都先由这个链处理）
#### （3）规则表之间的优先顺序
Raw——Mangle——Nat——filter
#### （4）规则链之间的优先顺序（分三种情况）
##### 第一种情况：入站数据流向
从外界到达防火墙的数据包，先被PREROUTING规则链处理（是否修改数据包地址等），之后会进行路由选择（判断该数据包应该发往何处）
，如果数据包的目标主机是防火墙本机（比如说Internet用户访问防火墙主机中的web服务器的数据包），那么内核将其传给INPUT链进
行处理（决定是否允许通过等），通过以后再交给系统上层的应用程序（比如Apache服务器）进行响应
##### 第二冲情况：转发数据流向
来自外界的数据包到达防火墙后，首先被PREROUTING规则链处理，之后会进行路由选择，如果数据包的目标地址是其它外部地址（比如局域
网用户通过网关访问QQ站点的数据包），则内核将其传递给FORWARD链进行处理（是否转发或拦截），然后再交给POSTROUTING规则链（
是否修改数据包的地址等）进行处理
##### 第三种情况：出站数据流向
防火墙本机向外部地址发送的数据包（比如在防火墙主机中测试公网DNS服务器时），首先被OUTPUT规则链处理，之后进行路由选择，然
后传递给POSTROUTING规则链（是否修改数据包的地址等）进行处理
## 命令行
~~~text
# 格式
iptables [-t 表名] 命令选项 ［链名］ ［条件匹配］ ［-j 目标动作或跳转］
# 说明：
表名、链名：    用于指定 iptables命令所操作的表和链；
命令选项：      用于指定管理iptables规则的方式（比如：插入、增加、删除、查看等）；
条件匹配：      用于指定对符合什么样条件的数据包进行处理；
目标动作或跳转：用于指定数据包的处理方式（比如允许通过、拒绝、丢弃、跳转（Jump）给其它链处理。

Commands:
Either long or short options are allowed.
  --append  -A chain            Append to chain
  --check   -C chain            Check for the existence of a rule
  --delete  -D chain            Delete matching rule from chain
  --delete  -D chain rulenum
                                Delete rule rulenum (1 = first) from chain
  --insert  -I chain [rulenum]
                                Insert in chain as rulenum (default 1=first)
  --replace -R chain rulenum
                                Replace rule rulenum (1 = first) in chain
  --list    -L [chain [rulenum]]
                                List the rules in a chain or all chains
  --list-rules -S [chain [rulenum]]
                                Print the rules in a chain or all chains
  --flush   -F [chain]          Delete all rules in  chain or all chains
  --zero    -Z [chain [rulenum]]
                                Zero counters in chain or all chains
  --new     -N chain            Create a new user-defined chain
  --delete-chain
            -X [chain]          Delete a user-defined chain
  --policy  -P chain target
                                Change policy on chain to target
  --rename-chain
            -E old-chain new-chain
                                Change chain name, (moving any references)   
Options:
    --ipv4      -4              Nothing (line is ignored by ip6tables-restore)
    --ipv6      -6              Error (line is ignored by iptables-restore)
[!] --protocol  -p proto        protocol: by number or name, eg. `tcp'
[!] --source    -s address[/mask][...]
                                source specification
[!] --destination -d address[/mask][...]
                                destination specification
[!] --in-interface -i input name[+]
                                network interface name ([+] for wildcard)
 --jump -j target
                                target for rule (may load target extension)
  --goto      -g chain
                              jump to chain with no return
  --match       -m match
                                extended match (may load extension)
  --numeric     -n              numeric output of addresses and ports
[!] --out-interface -o output name[+]
                                network interface name ([+] for wildcard)
  --table       -t table        table to manipulate (default: `filter')
  --verbose     -v              verbose mode
  --wait        -w [seconds]    maximum wait to acquire xtables lock before give up
  --wait-interval -W [usecs]    wait time to try to acquire xtables lock
                                default is 1 second
  --line-numbers                print line numbers when listing
  --exact       -x              expand numbers (display exact values)
[!] --fragment  -f              match second or further fragments only
  --modprobe=<command>          try to insert modules using this command
  --set-counters PKTS BYTES     set the counter during insert/append
[!] --version   -V              print package version.
                       
# 命令的管理控制选项
-A 在指定链的末尾添加（append）一条新的规则，当源（地址）或者/与 目的（地址）转换为多个地址时，这条
规则会加到所有可能的地址(组合)后面。
-D 删除（delete）指定链中的某一条规则，可以按规则序号和内容删除
-I 在指定链中插入（insert）一条新的规则，默认在第一行添加
-R 修改、替换（replace）指定链中的某一条规则，可以按规则序号和内容替换。规则序号从1开始，第一条就是序号1
-L 列出（list）指定链中所有的规则进行查看，如果没有选择链，所有链将被显示。也可以和z选项一起使用，这时链
会被自动列出和归零。精确输出受其它所给参数影响。
-E 重命名用户定义的链，不改变链本身
-F 清空（flush）
-N 新建（new-chain）一条用户自己定义的规则链。这个链必须没有被引用，如果被引用，在删除之前你必须删除或者
替换与之有关的规则。如果没有给出参数，这条命令将试着删除每个非内建的链。
-X 删除指定表中用户自定义的规则链（delete-chain）
-P 设置指定链的默认策略（policy）
-Z 将所有表的所有链的字节和数据包计数器清零，可以和 -L配合使用，在清空前察看计数器
-n 使用数字形式（numeric）显示输出结果
-v 查看规则表详细信息（verbose）的信息
-V 查看版本(version)
-h 获取帮助（help）
-p 规则或者包检查(待检查包)的协议。指定协议可以是tcp、udp、icmp中的一个或者全部，也可以是数值，代表这些
协议中的某一个。当然也可以使用在/etc/protocols中定义的协议名。在协议名前加上"!"表示相反的规则。数字0相当
于所有all。Protocol all会匹配所有协议，而且这是缺省时的选项。在和check命令结合时，all可以不被使用。
-s 指定源地址，可以是主机名、网络名和清楚的IP地址。mask说明可以是网络掩码或清楚的数字，在网络掩码的左边指
定网络掩码左边"1"的个数，因此，mask值为24等于255.255.255.0。在指定地址前加上"!"说明指定了相反的地址段。
标志 --src 是这个选项的简写。
-d 指定目标地址，要获取详细说明请参见 -s标志的说明。标志 --dst 是这个选项的简写
-j 目标跳转，指定规则的目标；也就是说，如果包匹配应当做什么。目标可以是用户自定义链（不是这条规则所在的），
某个会立即决定包的命运的专用内建目标，或者一个扩展（参见下面的EXTENSIONS）。如果规则的这个选项被忽略，那
么匹配的过程不会对包产生影响，不过规则的计数器会增加。
-i 这是包经由该接口接收的可选的入口名称，包通过该接口接收（在链INPUT、FORWORD和PREROUTING中进入的包）。
当在接口名前使用"!"说明后，指的是相反的名称。如果接口名后面加上"+"，则所有以此接口名开头的接口都会被匹配。
如果这个选项被忽略，会假设为"+"，那么将匹配任意接口。
-o 这是包经由该接口送出的可选的出口名称，包通过该口输出（在链FORWARD、OUTPUT和POSTROUTING中送出的包）。
当在接口名前使用"!"说明后，指的是相反的名称。如果接口名后面加上"+"，则所有以此接口名开头的接口都会被匹配。
如果这个选项被忽略，会假设为"+"，那么将匹配所有任意接口。
[!] -f, 这意味着在分片的包中，规则只询问第二及以后的片。自那以后由于无法判断这种把包的源端口或目标端口（或
者是ICMP类型的），这类包将不能匹配任何指定对他们进行匹配的规则。如果"!"说明用在了"-f"标志之前，表示相反的
意思。
其他选项
 还可以指定下列附加选项：
 
-v 详细输出。这个选项让list命令显示接口地址、规则选项（如果有）和TOS（Type of Service）掩码。包和字节
计数器也将被显示，分别用K、M、G(前缀)表示1000、1,000,000和1,000,000,000倍（不过请参看-x标志改变它），
对于添加,插入,删除和替换命令，这会使一个或多个规则的相关详细信息被打印。
 
-n 数字输出。IP地址和端口会以数字的形式打印。默认情况下，程序试显示主机名、网络名或者服务（只要可用）。
 
-x 精确扩展数字。显示包和字节计数器的精确值，代替用K,M,G表示的约数。这个选项仅能用于 -L 命令。
 
--line-numbers 当列表显示规则时，在每个规则的前面加上行号，与该规则在链中的位置相对应。
 
 
# 目标动作
ACCEPT 允许数据包通过
DROP   直接丢弃数据包，不给任何回应信息
REJECT 拒绝数据包通过，必要时会给数据发送端一个响应的信息。
LOG    在/var/log/messages文件中记录日志信息，然后将数据包传递给下一条规则
~~~
iptables能够使用一些与模块匹配的扩展包。以下就是含于基本包内的扩展包，而且他们大多数都可以通过在前面加上!来表示相反的意思
~~~text
tcp

当 --protocol tcp 被指定,且其他匹配的扩展未被指定时,这些扩展被装载。它提供以下选项：

--source-port [!] [port[:port]]
源端口或端口范围指定。这可以是服务名或端口号。使用格式端口：端口也可以指定包含的（端口）范围。
如果首端口号被忽略，默认是"0"，如果末端口号被忽略，默认是"65535"，如果第二个端口号大于第一个，
那么它们会被交换。这个选项可以使用 --sport的别名。
 
--destionation-port [!] [port:[port]]
目标端口或端口范围指定。这个选项可以使用 --dport别名来代替。
 
--tcp-flags [!] mask comp
匹配指定的TCP标记。第一个参数是我们要检查的标记，一个用逗号分开的列表，第二个参数是用逗号分开
的标记表,是必须被设置的。标记如下：SYN ACK FIN RST URG PSH ALL NONE。因此这条命令：
iptables -A FORWARD -p tcp --tcp-flags SYN, ACK, FIN, RST SYN只匹配那些SYN标记被设置而ACK、FIN和RST标记没有设置的包。
 
[!] --syn
只匹配那些设置了SYN位而清除了ACK和FIN位的TCP包。这些包用于TCP连接初始化时发出请求；例如，
大量的这种包进入一个接口发生堵塞时会阻止进入的TCP连接，而出去的TCP连接不会受到影响。
这等于 --tcp-flags SYN, RST, ACK SYN。如果"--syn"前面有"!"标记，表示相反的意思。
 
--tcp-option [!] number
匹配设置了TCP选项的。


udp
 
当protocol udp 被指定,且其他匹配的扩展未被指定时,这些扩展被装载,它提供以下选项：
 
--source-port [!] [port:[port]]
源端口或端口范围指定。详见 TCP扩展的--source-port选项说明。
 
--destination-port [!] [port:[port]]
目标端口或端口范围指定。详见 TCP扩展的--destination-port选项说明。



multiport
 
这个模块匹配一组源端口或目标端口,最多可以指定15个端口。只能和-p tcp 或者 -p udp 连着使用。
 
--source-port [port[, port]]
如果源端口是其中一个给定端口则匹配
 
--destination-port [port[, port]]
如果目标端口是其中一个给定端口则匹配
 
--port [port[, port]]
若源端口和目的端口相等并与某个给定端口相等,则匹配。



limit
 
这个模块匹配标志用一个标记桶过滤器一一定速度进行匹配,它和LOG目标结合使用来给出有限的登陆数.当达到这个极限值时,
使用这个扩展包的规则将进行匹配.(除非使用了"!"标记)
 
--limit rate
最大平均匹配速率：可赋的值有'/second', '/minute', '/hour', or '/day'这样的单位，默认是3/hour。
 
--limit-burst number
待匹配包初始个数的最大值:若前面指定的极限还没达到这个数值,则概数字加1.默认值为5



mac
 
--mac-source [!] address
匹配物理地址。必须是XX:XX:XX:XX:XX这样的格式。注意它只对来自以太设备并进入PREROUTING、FORWORD和INPUT链的包有效。


icmp
 
当protocol icmp被指定,且其他匹配的扩展未被指定时,该扩展被装载。它提供以下选项：
 
--icmp-type [!] typename
这个选项允许指定ICMP类型，可以是一个数值型的ICMP类型，或者是某个由命令iptables -p icmp -h所显示的ICMP类型名。



SNAT 这个目标只适用于nat表的POSTROUTING链。它规定修改包的源地址（此连接以后所有的包都会被影响），停止对规则的检查，
它包含选项：
 
--to-source [-][:port-port] 可以指定一个单一的新的IP地址，一个IP地址范围，也可以附加一个端口范围（只能在指定-p tcp 
或者-p udp的规则里）。如果未指定端口范围，源端口中512以下的（端口）会被安置为其他的512以下的端口；512到1024之间的端口
会被安置为1024以下的，其他端口会被安置为1024或以上。如果可能，端口不会被修改。
 
--to-destiontion [-][:port-port] 可以指定一个单一的新的IP地址，一个IP地址范围，也可以附加一个端口范围（只能在指定-p tcp 
或者-p udp的规则里）。如果未指定端口范围，目标端口不会被修改。



MASQUERADE 只用于nat表的POSTROUTING链。只能用于动态获取IP（拨号）连接：如果你拥有静态IP地址，你要用SNAT。伪装相当于
给包发出时所经过接口的IP地址设置一个映像，当接口关闭连接会终止。这是因为当下一次拨号时未必是相同的接口地址（以后所有建立
的连接都将关闭）。它有一个选项：

--to-ports [-port>] 指定使用的源端口范围，覆盖默认的SNAT源地址选择（见上面）。这个选项只适用于指定了-p tcp或者-p udp的规则。


REDIRECT 只适用于nat表的PREROUTING和OUTPUT链，和只调用它们的用户自定义链。它修改包的目标IP地址来发送包到机器自身
（本地生成的包被安置为地址127.0.0.1）。它包含一个选项：
 
--to-ports [ ] 指定使用的目的端口或端口范围：不指定的话，目标端口不会被修改。只能用于指定了-p tcp 或 -p udp的规则。


DIAGNOSTICS 诊断。不同的错误信息会打印成标准错误：退出代码0表示正确。类似于不对的或者滥用的命令行参数错误会返回错误代码2，
其他错误返回代码为1。



COMPATIBILITY WITH IPCHAINS  与ipchains的兼容性。iptables和Rusty Russell的ipchains非常相似。主要区别是INPUT 
链只用于进入本地主机的包,而OUTPUT只用于自本地主机生成的包。因此每个包只经过三个链的一个；以前转发的包会经过所有三个链。
其他主要区别是 -i 引用进入接口；-o引用输出接口，两者都适用于进入FORWARD链的包。当和可选扩展模块一起使用默认过滤器表时，
iptables是一个纯粹的包过滤器。这能大大减少以前对IP伪装和包过滤结合使用的混淆，所以以下选项作了不同的处理：
-j MASQ
-M -S
-M -L


TOS 用来设置IP包的首部八位tos。只能用于mangle表。
--set-tos tos 你可以使用一个数值型的TOS 值，或者用iptables -j TOS -h 来查看有效TOS名列表


MARK 用来设置包的netfilter标记值。只适用于mangle表。
--set-mark mark
REJECT 作为对匹配的包的响应，返回一个错误的包：其他情况下和DROP相同。此目标只适用于INPUT、FORWARD和OUTPUT链，和调用
这些链的用户自定义链。这几个选项控制返回的错误包的特性：
--reject-with type 
Type可以是icmp-net-unreachable、icmp-host-unreachable、icmp-port-nreachable、icmp-proto-unreachable、 
icmp-net-prohibited 或者 icmp-host-prohibited，该类型会返回相应的ICMP错误信息（默认是port-unreachable）。选项 
echo-reply也是允许的；它只能用于指定ICMP ping包的规则中，生成ping的回应。最后，选项tcp-reset可以用于在INPUT链中,或
自INPUT链调用的规则，只匹配TCP协议：将回应一个TCP RST包。


LOG 为匹配的包开启内核记录。当在规则中设置了这一选项后，linux内核会通过printk()打印一些关于全部匹配包的信息（诸如IP包头字段等）。
--log-level level
记录级别（数字或参看 syslog.conf(5)）。
--log-prefix prefix
在纪录信息前加上特定的前缀：最多14个字母长，用来和记录中其他信息区别。
--log-tcp-sequence
记录TCP序列号。如果记录能被用户读取那么这将存在安全隐患。
--log-tcp-options
记录来自TCP包头部的选项。
--log-ip-options
记录来自IP包头部的选项。


tos 此模块匹配IP包首部的8位tos（服务类型）字段（也就是说，包含在优先位中）。
--tos tos
这个参数可以是一个标准名称，（用iptables -m tos -h 察看该列表），或者数值。


state 此模块，当与连接跟踪结合使用时，允许访问包的连接跟踪状态。
--state state
这里state是一个逗号分割的匹配连接状态列表。可能的状态是:INVALID表示包是未知连接，ESTABLISHED表示是双向传送的连接，
NEW表示包为新的连接，否则是非双向传送的，而RELATED表示包由新连接开始，但是和一个已存在的连接在一起，如FTP数据传送，
或者一个ICMP错误。


 
owner 此模块试为本地生成包匹配包创建者的不同特征。只能用于OUTPUT链，而且即使这样一些包（如ICMP ping应答）还可能没
有所有者，因此永远不会匹配。
--uid-owner userid：如果给出有效的user id，那么匹配它的进程产生的包。
--gid-owner groupid：如果给出有效的group id，那么匹配它的进程产生的包。
--sid-owner seessionid：根据给出的会话组匹配该进程产生的包。


mark 这个模块和与netfilter过滤器标记字段匹配（就可以在下面设置为使用MARK标记）。
--mark value [/mask]：匹配那些无符号标记值的包（如果指定mask，在比较之前会给掩码加上逻辑的标记）。


MIRROR 这是一个试验示范目标，可用于转换IP首部字段中的源地址和目标地址，再传送该包,并只适用于INPUT、FORWARD和OUTPUT链，
以及只调用它们的用户自定义链。 
~~~
示例
~~~shell
#1、查看filter表的iptables规则，包括所有的链。filter表包含INPUT、OUTPUT、FORWARD三个规则链
#说明：-L是--list的简写，作用是列出规则。
iptables -L

#2、只查看某个表的中的规则。
#iptables -L [-t 表名]
# 说明：表名一共有三个：filter,nat,mangle，如果没有指定表名，则默认查看filter表的规则列表（就相当于第一条命令）。
iptables -L -t nat
iptables -L -t raw

#3、iptables -L [-t 表名] [链名]
#这里多了个链名，就是规则链的名称。
# 说明：iptables一共有INPUT、OUTPUT、FORWARD、PREROUTING、POSTROUTING五个规则链。
# 注意：链名必须大写。在Linux系统上，命令的大小写很敏感。
iptables -L INPUT

#4、说明：以数字形式显示规则。如果没有-n，规则中可能会出现anywhere，有了-n，它会变成0.0.0.0/
iptables -n -L INPUT

#5、说明：你也可以使用“iptables -L -nv”来查看，这个列表看起来更详细，对技术人员更友好
iptables -nvL INPUT
~~~
## 规则设置
### 添加常用策略
~~~shell
#1.拒绝进入防火墙的所有ICMP协议数据包
iptables -I INPUT -p icmp -j REJECT
 
 
#2.允许防火墙转发除ICMP协议以外的所有数据包
iptables -A FORWARD -p ! icmp -j ACCEPT  #说明：使用“！”可以将条件取反。
 
#3.拒绝转发来自192.168.1.10主机的数据，允许转发来自192.168.0.0/24网段的数据
iptables -A FORWARD -s 192.168.1.11 -j REJECT 
iptables -A FORWARD -s 192.168.0.0/24 -j ACCEPT
# 说明：注意要把拒绝的放在前面不然就不起作用了啊。
 
#4.丢弃从外网接口（eth1）进入防火墙本机的源地址为私网地址的数据包
iptables -A INPUT -i eth1 -s 192.168.0.0/16 -j DROP 
iptables -A INPUT -i eth1 -s 172.16.0.0/12 -j DROP 
iptables -A INPUT -i eth1 -s 10.0.0.0/8 -j DROP
 
#5.封堵网段（192.168.1.0/24），两小时后解封。
iptables -I INPUT -s 10.20.30.0/24 -j DROP 
iptables -I FORWARD -s 10.20.30.0/24 -j DROP 
at now 2 hours at> iptables -D INPUT 1 at> iptables -D FORWARD 1
# 说明：这个策略咱们借助crond计划任务来完成，就再好不过了。
#[1]   Stopped     at now 2 hours
 
#6.只允许管理员从202.13.0.0/16网段使用SSH远程登录防火墙主机。
iptables -A INPUT -p tcp --dport 22 -s 202.13.0.0/16 -j ACCEPT 
iptables -A INPUT -p tcp --dport 22 -j DROP
# 说明：这个用法比较适合对设备进行远程管理时使用，比如位于分公司中的SQL服务器需要被总公司的管理员管理时。
 
#7.允许本机开放从TCP端口20-1024提供的应用服务。
iptables -A INPUT -p tcp --dport 20:1024 -j ACCEPT 
iptables -A OUTPUT -p tcp --sport 20:1024 -j ACCEPT
 
#8.允许转发来自192.168.0.0/24局域网段的DNS解析请求数据包。
iptables -A FORWARD -s 192.168.0.0/24 -p udp --dport 53 -j ACCEPT 
iptables -A FORWARD -d 192.168.0.0/24 -p udp --sport 53 -j ACCEPT
 
#9.禁止其他主机ping防火墙主机，但是允许从防火墙上ping其他主机
iptables -I INPUT -p icmp --icmp-type Echo-Request -j DROP 
iptables -I INPUT -p icmp --icmp-type Echo-Reply -j ACCEPT 
iptables -I INPUT -p icmp --icmp-type destination-Unreachable -j ACCEPT
 
#10.禁止转发来自MAC地址为00：0C：29：27：55：3F的和主机的数据包
iptables -A FORWARD -m mac --mac-source 00:0c:29:27:55:3F -j DROP
# 说明：iptables中使用“-m 模块关键字”的形式调用显示匹配。咱们这里用“-m mac –mac-source”来表示数据包的源MAC地址。
 
#11.允许防火墙本机对外开放TCP端口20、21、25、110以及被动模式FTP端口1250-1280
iptables -A INPUT -p tcp -m multiport --dport 20,21,25,110,1250:1280 -j ACCEPT
# 说明：这里用“-m multiport –dport”来指定目的端口及范围

#12.禁止转发源IP地址为192.168.1.20-192.168.1.99的TCP数据包。
iptables -A FORWARD -p tcp -m iprange --src-range 192.168.1.20-192.168.1.99 -j DROP
# 说明：此处用“-m –iprange –src-range”指定IP范围。
 
#13.禁止转发与正常TCP连接无关的非—syn请求数据包。
iptables -A FORWARD -m state --state NEW -p tcp ! --syn -j DROP
# 说明：“-m state”表示数据包的连接状态，“NEW”表示与任何连接无关的，新的嘛！

#14.拒绝访问防火墙的新数据包，但允许响应连接或与已有连接相关的数据包
iptables -A INPUT -p tcp -m state --state NEW -j DROP 
iptables -A INPUT -p tcp -m state --state ESTABLISHED,RELATED -j ACCEPT
# 说明：“ESTABLISHED”表示已经响应请求或者已经建立连接的数据包，“RELATED”表示与已建立的连接有相关性的，比如FTP数据连接等。

#15.只开放本机的web服务（80）、FTP(20、21、20450-20480)，放行外部主机发住服务器其它端口的应答数据包，将其他入站数据包均予以丢弃处理。
iptables -I INPUT -p tcp -m multiport --dport 20,21,80 -j ACCEPT 
iptables -I INPUT -p tcp --dport 20450:20480 -j ACCEPT 
iptables -I INPUT -p tcp -m state --state ESTABLISHED -j ACCEPT 
iptables -P INPUT DROP
~~~
### 删除iptables规则
~~~shell
# 删除用-D参数
# 删除之前添加的规则（iptables -A INPUT -s 192.168.1.5 -j DROP）：
iptables -D INPUT -s 192.168.1.5 -j DROP
~~~
有时候要删除的规则太长，删除时要写一大串，既浪费时间又容易写错，这时可以先使用–line-number找出该条规则的行号，再通过行号删除规则。
~~~shell
iptables -nL --line-number
#删除第二行规则
iptables -D INPUT 2

iptables -F        #清除预设表filter中的所有规则链的规则
iptables -X        #清除预设表filter中使用者自定链中的规则
~~~
### 修改iptables规则
修改表中规则使用-R参数，修改链名用-E参数
~~~shell
iptables -nL --line-number
iptables -R INPUT 3 -j ACCEPT

# 用新的链名取代旧的链名
iptables -E old-chain-name new-chain-name
~~~
### 防火墙规则的保存与恢复
iptables-save把规则保存到文件中，再由目录rc.d下的脚本（/etc/rc.d/init.d/iptables）自动装载
~~~shell
# 使用命令iptables-save来保存规则，生成保存规则的文件 /etc/sysconfig/iptables
iptables-save > /etc/sysconfig/iptables
# 也可以用
service iptables save  # 它能把规则自动保存在/etc/sysconfig/iptables中
# 当计算机启动时，rc.d下的脚本将用命令iptables-restore调用这个文件，从而就自动恢复了规则
~~~
