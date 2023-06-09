---
title: docker-entrypoint.sh脚本
categories: docker
tags:
  - docker
  - docker-entrypoint.sh
date: 2023-06-09 14:13:44
---

## 出处
很多著名库的Dockerfile文件中，通常都是ENTRYPOINT字段是这样：
~~~dockerfile
ENTRYPOINT ["docker-entrypoint.sh"]
~~~
## 用处
我们参考分析下MySQL的Dockerfile文件，来认识下docker-entrypoint.sh的用处
~~~shell
#!/bin/bash
set -eo pipefail
shopt -s nullglob

# if command starts with an option, prepend mysqld
if [ "${1:0:1}" = '-' ]; then
	set -- mysqld "$@"
fi

# skip setup if they want an option that stops mysqld
wantHelp=
for arg; do
	case "$arg" in
		-'?'|--help|--print-defaults|-V|--version)
			wantHelp=1
			break
			;;
	esac
done

# usage: file_env VAR [DEFAULT]
#    ie: file_env 'XYZ_DB_PASSWORD' 'example'
# (will allow for "$XYZ_DB_PASSWORD_FILE" to fill in the value of
#  "$XYZ_DB_PASSWORD" from a file, especially for Docker's secrets feature)
file_env() {
	local var="$1"
	local fileVar="${var}_FILE"
	local def="${2:-}"
	if [ "${!var:-}" ] && [ "${!fileVar:-}" ]; then
		echo >&2 "error: both $var and $fileVar are set (but are exclusive)"
		exit 1
	fi
	local val="$def"
	if [ "${!var:-}" ]; then
		val="${!var}"
	elif [ "${!fileVar:-}" ]; then
		val="$(< "${!fileVar}")"
	fi
	export "$var"="$val"
	unset "$fileVar"
}

# usage: process_init_file FILENAME MYSQLCOMMAND...
#    ie: process_init_file foo.sh mysql -uroot
# (process a single initializer file, based on its extension. we define this
# function here, so that initializer scripts (*.sh) can use the same logic,
# potentially recursively, or override the logic used in subsequent calls)
process_init_file() {
	local f="$1"; shift
	local mysql=( "$@" )

	case "$f" in
		*.sh)     echo "$0: running $f"; . "$f" ;;
		*.sql)    echo "$0: running $f"; "${mysql[@]}" < "$f"; echo ;;
		*.sql.gz) echo "$0: running $f"; gunzip -c "$f" | "${mysql[@]}"; echo ;;
		*)        echo "$0: ignoring $f" ;;
	esac
	echo
}

_check_config() {
	toRun=( "$@" --verbose --help )
	if ! errors="$("${toRun[@]}" 2>&1 >/dev/null)"; then
		cat >&2 <<-EOM

			ERROR: mysqld failed while attempting to check config
			command was: "${toRun[*]}"

			$errors
		EOM
		exit 1
	fi
}

# Fetch value from server config
# We use mysqld --verbose --help instead of my_print_defaults because the
# latter only show values present in config files, and not server defaults
_get_config() {
	local conf="$1"; shift
	"$@" --verbose --help --log-bin-index="$(mktemp -u)" 2>/dev/null \
		| awk '$1 == "'"$conf"'" && /^[^ \t]/ { sub(/^[^ \t]+[ \t]+/, ""); print; exit }'
	# match "datadir      /some/path with/spaces in/it here" but not "--xyz=abc\n     datadir (xyz)"
}

# allow the container to be started with `--user`
if [ "$1" = 'mysqld' -a -z "$wantHelp" -a "$(id -u)" = '0' ]; then
	_check_config "$@"
	DATADIR="$(_get_config 'datadir' "$@")"
	mkdir -p "$DATADIR"
	chown -R mysql:mysql "$DATADIR"
	exec gosu mysql "$BASH_SOURCE" "$@"
fi

if [ "$1" = 'mysqld' -a -z "$wantHelp" ]; then
	# still need to check config, container may have started with --user
	_check_config "$@"
	# Get config
	DATADIR="$(_get_config 'datadir' "$@")"

	if [ ! -d "$DATADIR/mysql" ]; then
		file_env 'MYSQL_ROOT_PASSWORD'
		if [ -z "$MYSQL_ROOT_PASSWORD" -a -z "$MYSQL_ALLOW_EMPTY_PASSWORD" -a -z "$MYSQL_RANDOM_ROOT_PASSWORD" ]; then
			echo >&2 'error: database is uninitialized and password option is not specified '
			echo >&2 '  You need to specify one of MYSQL_ROOT_PASSWORD, MYSQL_ALLOW_EMPTY_PASSWORD and MYSQL_RANDOM_ROOT_PASSWORD'
			exit 1
		fi

		mkdir -p "$DATADIR"

		echo 'Initializing database'
		"$@" --initialize-insecure
		echo 'Database initialized'

		if command -v mysql_ssl_rsa_setup > /dev/null && [ ! -e "$DATADIR/server-key.pem" ]; then
			# https://github.com/mysql/mysql-server/blob/23032807537d8dd8ee4ec1c4d40f0633cd4e12f9/packaging/deb-in/extra/mysql-systemd-start#L81-L84
			echo 'Initializing certificates'
			mysql_ssl_rsa_setup --datadir="$DATADIR"
			echo 'Certificates initialized'
		fi

		SOCKET="$(_get_config 'socket' "$@")"
		"$@" --skip-networking --socket="${SOCKET}" &
		pid="$!"

		mysql=( mysql --protocol=socket -uroot -hlocalhost --socket="${SOCKET}" )

		for i in {30..0}; do
			if echo 'SELECT 1' | "${mysql[@]}" &> /dev/null; then
				break
			fi
			echo 'MySQL init process in progress...'
			sleep 1
		done
		if [ "$i" = 0 ]; then
			echo >&2 'MySQL init process failed.'
			exit 1
		fi

		if [ -z "$MYSQL_INITDB_SKIP_TZINFO" ]; then
			# sed is for https://bugs.mysql.com/bug.php?id=20545
			mysql_tzinfo_to_sql /usr/share/zoneinfo | sed 's/Local time zone must be set--see zic manual page/FCTY/' | "${mysql[@]}" mysql
		fi

		if [ ! -z "$MYSQL_RANDOM_ROOT_PASSWORD" ]; then
			export MYSQL_ROOT_PASSWORD="$(pwgen -1 32)"
			echo "GENERATED ROOT PASSWORD: $MYSQL_ROOT_PASSWORD"
		fi

		rootCreate=
		# default root to listen for connections from anywhere
		file_env 'MYSQL_ROOT_HOST' '%'
		if [ ! -z "$MYSQL_ROOT_HOST" -a "$MYSQL_ROOT_HOST" != 'localhost' ]; then
			# no, we don't care if read finds a terminating character in this heredoc
			# https://unix.stackexchange.com/questions/265149/why-is-set-o-errexit-breaking-this-read-heredoc-expression/265151#265151
			read -r -d '' rootCreate <<-EOSQL || true
				CREATE USER 'root'@'${MYSQL_ROOT_HOST}' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}' ;
				GRANT ALL ON *.* TO 'root'@'${MYSQL_ROOT_HOST}' WITH GRANT OPTION ;
			EOSQL
		fi

		"${mysql[@]}" <<-EOSQL
			-- What's done in this file shouldn't be replicated
			--  or products like mysql-fabric won't work
			SET @@SESSION.SQL_LOG_BIN=0;

			ALTER USER 'root'@'localhost' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}' ;
			GRANT ALL ON *.* TO 'root'@'localhost' WITH GRANT OPTION ;
			${rootCreate}
			DROP DATABASE IF EXISTS test ;
			FLUSH PRIVILEGES ;
		EOSQL

		if [ ! -z "$MYSQL_ROOT_PASSWORD" ]; then
			mysql+=( -p"${MYSQL_ROOT_PASSWORD}" )
		fi

		file_env 'MYSQL_DATABASE'
		if [ "$MYSQL_DATABASE" ]; then
			echo "CREATE DATABASE IF NOT EXISTS \`$MYSQL_DATABASE\` ;" | "${mysql[@]}"
			mysql+=( "$MYSQL_DATABASE" )
		fi

		file_env 'MYSQL_USER'
		file_env 'MYSQL_PASSWORD'
		if [ "$MYSQL_USER" -a "$MYSQL_PASSWORD" ]; then
			echo "CREATE USER '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD' ;" | "${mysql[@]}"

			if [ "$MYSQL_DATABASE" ]; then
				echo "GRANT ALL ON \`$MYSQL_DATABASE\`.* TO '$MYSQL_USER'@'%' ;" | "${mysql[@]}"
			fi

			echo 'FLUSH PRIVILEGES ;' | "${mysql[@]}"
		fi

		echo
		ls /docker-entrypoint-initdb.d/ > /dev/null
		for f in /docker-entrypoint-initdb.d/*; do
			process_init_file "$f" "${mysql[@]}"
		done

		if [ ! -z "$MYSQL_ONETIME_PASSWORD" ]; then
			"${mysql[@]}" <<-EOSQL
				ALTER USER 'root'@'%' PASSWORD EXPIRE;
			EOSQL
		fi
		if ! kill -s TERM "$pid" || ! wait "$pid"; then
			echo >&2 'MySQL init process failed.'
			exit 1
		fi

		echo
		echo 'MySQL init process done. Ready for start up.'
		echo
	fi
fi

exec "$@"
~~~
在启动容器时，可以通过shell脚本执行些预处理逻辑，然后通过exec "$@"，把启动容器入口正式交给使用者
## 文件编辑
#### set -e
你写的每个脚本都应该在文件开头加上set -e, 这句语句告诉bash如果任何语句的执行结果不是true则应该退出. 
这样的好处是防止错误像滚雪球般变大导致一个致命的错误, 而这些错误本应该在之前就被处理掉. 如果要增加可
读性, 可以使用set -o errexit, 它的作用与set -e相同
#### set -o pipefail
设计用途同上, 就是希望在执行错误之后立即退出, 不要再向下执行了. 而 -o pipefail 的作用域是管道, 也
就是说在Linux脚本中的管道, 如果前面的命令执行出了问题, 应该立即退出
#### shopt -s nullglob
在使用Linux中的通配符时 * ?等如果没有匹配到任何文件, 不会报 No such file or directory 而是将命
令后面的参数去掉执行
#### if [ “${1:0:1}” = ‘-‘ ]; then…
这是一个判断语句, 在官方文件中, 上一行已经给出了注释: if command starts with an option, prepend
mysqld 这个判断语句是 ${1:0:1} 意思是判断 $1(调用该脚本的第一个参数), 偏移量0(不偏移), 取一个字符
(取字符串的长度)如果判断出来调用这个脚本后面所跟的参数第一个字符是-中横线的话, 就认为后面的所有字符串都
是 mysqld 的启动参数 上面的这个操作类似于 Python 的字符串切片
#### set – mysqld “$@”
在上面判断完第一个参数是-开头之后, 紧接着就执行了 set -- mysqld "$@" 这个命令. 使用了 set -- 的用
法. set —会将他后面所有以空格区分的字符串, 按顺序分别存储到$1, $2, $3 变量中, 其中新的$@ 为 set — 
后面的全部内容
举例来说: bash docker-entrypoint.sh -f xxx.conf
在这种情况下, set -- mysqld "$@" 中的 $@ 的值为 -f xxx.conf
当执行完 set -- mysqld "$@" 这条命令后:
$1=mysqld
$2=-f
$3=xxx.conf
$@=mysqld -f xxx.conf
可以看到, 当执行 docker-entrypoint.sh脚本的时候后面加了 -x形式的参数之后, $@的值发生的改变, 在原有
$@值的基础之上, 在前面又预添加了 mysqld 命令
#### exec “$@”
几乎在每个 docker-entrypoint.sh 脚本的最后一行, 执行的都是 exec "$@"命令
这个命令的意义在于你已经为你的镜像预想到了应该有的调用情况, 当实际使用镜像的人执行了你没有预料到的可执行
命令时, 将会走到脚本的这最后一行, 去执行用户新的可执行命令
#### 情况判断
上面直接说了脚本的最后一行, 在之前的脚本中, 需要充分的去考虑你自己的脚本可能会被调用的情况. 还是拿MySQL
官方的dockerfile来说, 他判断以下情况:
开头是 - , 认为是参数的情况
开头是 mysqld, 且用户 id 为0 (root 用户) 的情况
开头是 mysqld 的情况
判断完自己应用的所有调用形态之后, 最后应该加上exec "$@" 命令兜底
#### ${mysql[@]}
Shell 中的数组, 直接执行 ${mysql[@]} 会把这个数组当做可执行程序来执行
~~~shell
mysql=( mysql --protocol=socket -uroot -hlocalhost --socket="${SOCKET}" )
echo ${mysql[1]}
#mysql
echo ${mysql[2]}
#--protocol=socket
echo ${mysql[3]}
#-uroot
echo ${mysql[4]}
#-hlocalhost
echo ${mysql[@]}
mysql --protocol=socket -uroot -hlocalhost --socket=
~~~
#### exec gosu mysql “$BASH_SOURCE” “$@”
这里的 gosu 命令, 是 Linux 中 sudo 命令的轻量级”替代品”
gosu 是一个 golang 语言开发的工具, 用来取代 shell 中的 sudo 命令. su 和 sudo 命令有一些缺陷, 主要
是会引起不确定的 TTY, 对信号量的转发也存在问题. 如果仅仅为了使用特定的用户运行程序, 使用 su 或 sudo 显
得太重了, 为此 gosu 应运而生.
gosu 直接借用了 libcontainer 在容器中启动应用程序的原理, 使用 /etc/passwd 处理应用程序. gosu 首先
找出指定的用户或用户组, 然后切换到该用户或用户组. 接下来, 使用 exec 启动应用程序. 到此为止, gosu 完成
了它的工作, 不会参与到应用程序后面的声明周期中. 使用这种方式避免了 gosu 处理 TTY 和转发信号量的问题, 把
这两个工作直接交给了应用程序去完成
