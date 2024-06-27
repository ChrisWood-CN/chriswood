---
title: gradle环境配置
date: 2024-06-22 16:40:11
categories: Gradle
tags:
  - Configurations
---

## Gradle 官网

[https://gradle.org/](https://gradle.org/)

## Gradle 项目国内环境配置

一般 android 项目使用 gradle 构建，idea 的 java 项目或 kotlin 项目也逐步使用 gradle 管理依赖和构建

使用国内环境配置分两种

### 本地 gradle

本地安装好 gradle，idea 或 android studio 设置使用本地指定版本的 gradle,本地安装一般全局配置国内镜像地址，也可以用项目配置，参考[项目 wrapper 的 gradle 中的项目配置](#项目-wrapper-的-gradle)。

> 实际使用中，阿里云的 google 镜像拉取不到 androidx 的部分依赖，这里直接科学上网使用 GOOGLE 地址，也可搜索其他方法解决

全局配置 init.gradle 文件（系统安装的.gradle 文件夹内）

```gradle
allprojects{
    repositories {
        def ALIYUN_REPOSITORY_URL = 'https://maven.aliyun.com/repository/public'
        def ALIYUN_JCENTER_URL = 'https://maven.aliyun.com/repository/central'
        def ALIYUN_GOOGLE_URL = 'https://maven.aliyun.com/repository/google'
        def ALIYUN_GRADLE_PLUGIN_URL = 'https://maven.aliyun.com/repository/gradle-plugin'
        def GOOGLE = "https://dl.google.com/dl/android/maven2/"
        maven { url ALIYUN_REPOSITORY_URL }
        maven { url ALIYUN_JCENTER_URL }
        maven { url ALIYUN_GOOGLE_URL }
        maven { url ALIYUN_GRADLE_PLUGIN_URL }
        maven { url GOOGLE }
    }
}
```

### 项目 wrapper 的 gradle

使用 wrapper 中的 gradle 版本

> wrapper 中的 distributionUrl 需要个更换成国内镜像地址，否则拉取速度太慢或者直接拉取不到
> 原始地址为 https://services.gradle.org/distributions/
> 腾讯镜像：https://mirrors.cloud.tencent.com/gradle/
> 阿里云镜像：https://mirrors.aliyun.com/macports/distfiles/gradle/

项目配置 settings.gradle.kts 文件（项目文件夹内）

```gradle
val ALIYUN_REPOSITORY_URL = "https://maven.aliyun.com/repository/public"
val ALIYUN_JCENTER_URL = "https://maven.aliyun.com/repository/central"
val ALIYUN_GOOGLE_URL = "https://maven.aliyun.com/repository/google"
val ALIYUN_GRADLE_PLUGIN_URL = "https://maven.aliyun.com/repository/gradle-plugin"
val GOOGLE = "https://dl.google.com/dl/android/maven2/"

pluginManagement {
    repositories {
        maven { url = uri(ALIYUN_REPOSITORY_URL) }
        maven { url = uri(ALIYUN_JCENTER_URL) }
        maven { url = uri(ALIYUN_GOOGLE_URL) }
        maven { url = uri(ALIYUN_GRADLE_PLUGIN_URL) }
        maven { url = uri(GOOGLE) }
    }
}

dependencyResolutionManagement {
    repositories {
        maven { url = uri(ALIYUN_REPOSITORY_URL) }
        maven { url = uri(ALIYUN_JCENTER_URL) }
        maven { url = uri(ALIYUN_GOOGLE_URL) }
        maven { url = uri(ALIYUN_GRADLE_PLUGIN_URL) }
        maven { url = uri(GOOGLE) }
    }
}
```
