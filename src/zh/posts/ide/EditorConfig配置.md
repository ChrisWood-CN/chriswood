---
title: EditorConfig配置
date: 2023-05-18 08:08:20
categories:
- IDE
tags:
- EditorConfig
---
### 1 EditorConfig插件
https://editorconfig.org/#pre-installed
### 2 .editorconfig 配置文件
- .editorconfig 自定义文件是用来定义编辑器的编码格式规范，编辑器的行为会与 .editorconfig 文件中定义的一致，并且其优先级比编辑器自身的设置高

- EditorConfig 插件会读取 .editorconfig 文件中定义的内容，应用于编辑器
#### .editorconfig文件格式
https://editorconfig.org/
~~~.editorconfig
# 每次打开文件EditorConfig 插件在打开文件的目录和每个父目录中
# 查找名为 .editorconfig 的文件，如果到达根文件路径或找到 
# root=true 的 EditorConfig 文件，将停止搜索并应用
root = true
# 匹配全部文件
[*]
# 结尾换行符，可选"lf"、"cr"、"crlf"
end_of_line = lf
# 在文件结尾插入新行
insert_final_newline = true
# 删除一行中的前后空格
trim_trailing_whitespace = true
# 匹配js和py结尾的文件
[*.{js,py}]
# 设置字符集
charset = utf-8

# 匹配py结尾的文件
[*.py]
# 缩进风格，可选"space"、"tab"
indent_style = space
# 缩进的空格数
indent_size = 4
[*.md]
trim_trailing_whitespace = false

# 以下匹配，类同
[Makefile]
indent_style = tab# tab的宽度tab_width = 4
# 以下匹配，类同
[lib/**.js]
indent_style = space
indent_size = 2

[{package.json,.travis.yml}]
indent_style = space
indent_size = 2
~~~
#### 语法
editorConfig配置文件需要是UTF-8字符集编码的, 以回车换行或换行作为一行的分隔符。
斜线(/)被用作为一个路径分隔符，井号(#)或分号(;)被用作于注释. 注释需要与注释符号写在同一行。

#### .editorconfig匹配符
~~~
*                匹配除/之外的任意字符串
**               匹配任意字符串
?                匹配任意单个字符
[name]           匹配name中的任意一个单一字符
[!name]          匹配不存在name中的任意一个单一字符
{s1,s2,s3}       匹配给定的字符串中的任意一个(用逗号分隔) 
{num1..num2}   　匹配num1到num2之间的任意一个整数, 这里的num1和num2可以为正整数也可以为负整数
~~~
#### 支持的属性
~~~
indent_style    设置缩进风格(tab是硬缩进，space为软缩进)
indent_size     用一个整数定义的列数来设置缩进的宽度，如果indent_style为tab，则此属性默认为tab_width
tab_width       用一个整数来设置tab缩进的列数。默认是indent_size
end_of_line     设置换行符，值为lf、cr和crlf
charset         设置编码，值为latin1、utf-8、utf-8-bom、utf-16be和utf-16le，不建议使用utf-8-bom
trim_trailing_whitespace  设为true表示会去除换行行首的任意空白字符。
insert_final_newline      设为true表示使文件以一个空白行结尾
root        　　　表示是最顶层的配置文件，发现设为true时，才会停止查找.editorconfig文件
~~~
