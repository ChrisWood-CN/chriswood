---
title: SuppressWarnings注解
date: 2023-04-04 13:25:46
tags: Java Spring
---

# SuppressWarnings注解

## 标准用法对应表

| 关键字 | 用途 |
|:------:|:------:| 
|    all     |   to suppress all warnings  | 
|    boxing     |  to suppress warnings relative to boxing/unboxing operations  |  
|cast|    to suppress warnings relative to cast operations|
|dep-ann|    to suppress warnings relative to deprecated annotation|
|deprecation|    to suppress warnings relative to deprecation|
|fallthrough|     to suppress warnings relative to missing breaks in switch statements|
|finally|    to suppress warnings relative to finally block that don’t return|
|hiding|    to suppress warnings relative to locals that hide variable|
|incomplete-switch|     to suppress warnings relative to missing entries in a switch statement (enum case)|
|nls|     to suppress warnings relative to non-nls string literals|
|null|    to suppress warnings relative to null analysis|
|rawtypes|    to suppress warnings relative to un-specific types when using generics on class params|
|restriction|    to suppress warnings relative to usage of discouraged or forbidden references|
|serial|    to suppress warnings relative to missing serialVersionUID field for a serializable class|
|static-access|    o suppress warnings relative to incorrect static access|
|synthetic-access|     to suppress warnings relative to unoptimized access from inner classes|
|unchecked|     to suppress warnings relative to unchecked operations|
|unqualified-field-access|    to suppress warnings relative to field access unqualified|
|unused|    to suppress warnings relative to unused code|
## idea扩展用法对应表
| 关键字 | 用途 |
|:------:|:------:|
|UnnecessaryLocalVariable|	Local variable ‘userId’ is redundant|
|FieldCanBeLocal|	Field can be converted to a local variable|
## idea 在Spring以及SpringBoot等Spring的衍生项目中提供的语法警告
| 关键字 | 用途 |
|:------:|:------:|
|SpringJavaInjectionPointsAutowiringInspection|	Could not autowire. No beans of ‘XXX’ type found.|
|SpringJavaAutowiredFieldsWarningInspection|	Field injection is not recommended|
|ConfigurationProperties|	Not registered via @EnableConfigurationProperties or marked as Spring component|
|ConstantConditions|	Condition ‘xxx != null’ is always ‘true’|

