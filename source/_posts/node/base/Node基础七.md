---
title: Node基础七
date: 2022-10-01 12:27:50
categories: Node
tags: Node Node基础系列
pre: Node基础六
next: Node基础八
---

## 七.脚手架开发

目前前端工程化开发过程中，我们会使用各种各样的脚手架，vue-cli、create-react-app，当然也包括webpack、gulp、rollup、vite等工具。

这些工具是怎么开发出来的呢？当我们执行一个命令时，它们做了什么事情？是怎么样完成的一系列操作？

这里我开发了一个coderwhy的脚手架：一个帮助你快速搭建和开发前端项目的CLI。

文档内容分成两部分：

第一部分：coderwhy使用说明；

第二部分：coderwhy脚手架开发过程；

如何安装？

```
npm install coderwhy -g
```

### 使用说明

### 一. 创建项目

目前支持Vue，后期会支持React，Angular考虑中~

vue项目模块已经帮你配置：

- 常用的目录结构（你可以在此基础上修改）
- vue.config.js（其中配置了别名，你可以自行修改和配置更多）
- axios（网络请求axios的安装以及二次封装）
- vue-router（router的安装和配置，另外有路由的动态加载，后面详细说明）
- vuex（vuex的安装和配置，另外有动态加载子模块，后面详细说明）

创建项目

```
coderwhy create your_project_name
```

自动拉取项目模板、安装项目依赖、打开浏览器 `http://localhost:8080/`、自动启动项目

### 二. 项目开发

项目开发目前提供三个功能：

- 创建Vue组件
- 创建Vue页面，并配置路由
- 创建Vuex子模块

#### 2.1. 创建Vue组件：

```
coderwhy addcpn YourComponentName # 例如coderwhy add NavBar，默认会存放到src/components文件夹中
coderwhy addcpn YourComponentName -d src/pages/home # 也可以指定存放的具体文件夹
```

#### 2.2. 创建Vue页面，并配置路由

```
coderwhy addpage YourPageName # 例如coderwhy addpage Home，默认会放到src/pages/home/Home.vue中，并且会创建src/page/home/router.js
coderwhy addpage YourPageName -d src/views # 也可以指定文件夹，但需要手动集成路由
```

为什么会创建router.js文件：

- `router.js`文件是路由的其中一个配置；
- 创建该文件中 `src/router/index.js`中会自动加载到路由的 `routes`配置中，不需要手动配置了（如果是自己配置的文件夹需要手动配置）

`src/router/index.js`中已经完成如下操作：

```
// 动态加载pages中所有的路由文件
const files = require.context('@/pages', true, /router\.js$/);
const routes = files.keys().map(key => {
  const page = require('@/pages' + key.replace('.', ''));
  return page.default;
})
```

#### 2.3. 创建Vuex子模块

```
coderwhy addstore YourVuexChildModuleName # 例如coderwhy addstore home，默认会放到src/store/modules/home/index.js和types.js
coderwhy addstore YourVuexChildModuleName -d src/vuex/modules # 也可以指定文件夹
```

创建完成后，不需要手动配置，已经动态将所有子模块集成进去：

```
// 动态加载modules
const modules = {}
const files = require.context('./', true, /index\.js$/);
files.keys().filter(key => {
  if (key === './index.js') return false;
  return true
}).map(key => {  
  // 获取名字
  const modulePath = key.replace('./modules/', '');
  const moduleName = modulePath.replace('/index.js', '');
  const module = require(`${key}`);

  modules[`${moduleName}`] = module.default;
})
```

## 脚手架开发过程

### 一. 创建文件

创建index.js

```
console.log("Hello Coderwhy")
```

创建package.json

```
{
  "name": "coderwhy",
  "version": "1.1.0",
  "description": "CLI front-end development tools",
  "main": "index.js",
  "bin": {
    "coderwhy": "index.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "vue",
    "react",
    "CLI",
    "component"
  ],
  "author": "coderwhy",
  "license": "MIT",
  "homepage": "https://github.com/coderwhy/coderwhy",
  "repository": {
    "type": "git",
    "url": "https://github.com/coderwhy/coderwhy"
  },
  "dependencies": {
    "chalk": "^4.1.0",
    "commander": "^6.1.0",
    "download-git-repo": "^3.0.2",
    "ejs": "^3.1.5",
    "open": "^7.3.0"
  }
}
```

最终的目录结构：

```
├── LICENSE
├── index.js
├── lib
│   ├── config
│   │   └── repo_config.js
│   ├── core
│   │   ├── actions.js
│   │   ├── create.js
│   │   └── help.js
│   ├── template
│   │   ├── component.vue.ejs
│   │   ├── vue-router.js.ejs
│   │   ├── vue-store.js.ejs
│   │   └── vue-types.js.ejs
│   └── utils
│       ├── file.js
│       ├── log.js
│       └── terminal.js
├── package-lock.json
├── package.json
└── readme.md
```

### 二. 创建coderwhy的命令

自动在你的环境变量中查找node

注意：必须放在第一行

```
#!/usr/bin/env node
```

修改package.json

```
  "bin": {
    "coderwhy": "index.js"
  }
```

执行npm link

### 三. commander用法

#### 3.1. 定义版本号

```
#!/usr/bin/env node
const cmd = require('commander');
// 定义显示模块的版本号
cmd.version(require('./package.json').version);
// 解析终端指令
cmd.parse(process.argv);
```

#### 3.2. 给help增加其他选项

添加单个选项

```
program.option('-s --src <src>', 'a source folder');
program.option('-d --dest <dest>', 'a destination folder');
program.option('-f --framework <framework>', 'your framework name');
```

监听help指令

```
program.on('--help', function() {
  console.log("");
  console.log("usage");
  console.log("   coderwhy -v");
  console.log("   coderwhy -version");
})
```

### 四. 创建项目指令

```
// 创建命令
program
  .command('create <project> [otherArgs...]')
  .description('clone a repository into a newly created directory')
  .action((project, otherArgs) => {
    console.log(project);
    console.log(otherArgs);
   // 调用封装的函数
   createProject(project, otherArgs)
  })
```

在actions中封装创建过程：

```
const downloadRepo = promisify(require('download-git-repo'));

const createProject = async (project, otherArg) => {
  // 1.提示信息
  console.log('coderwhy helps you create your project, please wait a moment~');

  // 2.clone项目从仓库
  await downloadRepo(repoConfig.vueGitRepo, project, { clone: true });

  // 3.执行终端命令npm install
  // terminal.exec('npm install', {cwd: `./${project}`});
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  await terminal.spawn(npm, ['install'], { cwd: `./${project}` });

  // 4.打开浏览器
  open('http://localhost:8080/');

  // 5.运行项目
  await terminal.spawn(npm, ['run', 'serve'], { cwd: `./${project}` });
}
```

配置的Git地址如下：

- 后续会开发一个设置自己地址的指令

```
const vueGitRepo = "direct:https://github.com/coderwhy/hy-vue-temp.git";

module.exports = {
  vueGitRepo
}
```

封装执行终端命令的过程：

```
const { spawn, exec } = require('child_process');

const spawnCommand = (...args) => {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(...args);
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);
    childProcess.on('close', () => {
      resolve();
    });
  })
}
```

#### **process和child_process使用**

##### process

在Node.js中每个应用程序都是一个进程类的实例对象。使用process对象代表应用程序,这是一个全局对象，可以通过它来获取Node.jsy应用程序以及运行该程序的用户、环境等各种信息的属性、方法和事件

进程中几个重要的属性

```
stdin 标准输入可读流
stdout 标准输入可写流
stderr 标准错误输出流
argv 终端输入参数数组
env 操作系统环境信息
pid 应用程序进程id
```

进程方法

```
process.memoryUsage() 查看内存使用信息
process.nextTick() 当前eventloop执行完毕执行回调函数
process.chdir() chdir方法用于修改Node.js应用程序中使用的当前工作目录
process.cwd() 进程当前工作目录
process.kill() 杀死进程
process.uncaughtException() 当应用程序抛出一个未被捕获的异常时触发进程对象的uncaughtException事件
```

##### child_process

在Node.js中，提供了一个child_process模块,通过它可以开启多个子进程，在多个子进程之间可以共享内存空间，可以通过子进程的互相通信来实现信息的交换,child_process模块给予node任意创建子进程的能力，node官方文档对于child_proces模块给出了四种方法，映射到操作系统其实都是创建子进程。但对于开发者而已，这几种方法的api有点不同

```
child_process.exec(command[, options][, callback]) 启动子进程来执行shell命令,可以通过回调参数来获取脚本shell执行结果
child_process.execfile(file[, args][, options][, callback]) 与exec类型不同的是，它执行的不是shell命令而是一个可执行文件
child_process.spawn(command[, args][, options])仅仅执行一个shell命令，不需要获取执行结果\
child_process.fork(modulePath[, args][, options]) 可以用node执行的.js文件，也不需要获取执行结果。fork出来的子进程一定是node进程
```

```js
//exec用法:
//执行shell脚本, 使用管道符也是可以的
//exec也是可以执行文件的，只不过不能传参数
//适合开销比较小的任务
const cp = require('child_process')
cp.exec('ls -al|grep node_modules', { 
  timeout: 0, // 超时时间
  cwd: process.cwd(), // 可以改变当前的执行路径
  }, function (err, stdout, stderr) {
  // 执行结果
})

//execFile用法:
//可以执行文件，也可以执行语句，可传参
//适合开销比较小的任务
// 执行文件,参数
cp.execFile('ls', ['-al'], function (err, stdout, std,err) => {
  // 执行结果
})
// 让execFile执行ls -al|grep node_modules这种语句
//test.shell:
  ls -al|grep node_modules
  echo $1 // 打印参数
  echo $2
//index.js:
cp.execFile(path.resolve(__dirname, 'test.shell'), ['-al', 'bl'], 
function(err,   stdout, stderr) {
})

//fork用法
//用node执行, 耗时操作且用node实现，如下载文件

// cp.fork(模块路径)
// 和require一样把文件执行起来
const child = cp.fork(path.resolve(__dirname, 'child_process_demo'))
console.log(process.pid)
// 主进程向子进程通信
child.send('hello child_process', () => {
  // child.disconnent() // 如果不断开，两边会出现等待的情况
})
// 子进程向主进程通信
child.on('message', msg => {
  
})

// child_process_demo.js:
console.log('aaa', process.pid)
process.on('message', msg => {
  console.log(msg)
  // 很容易出现死循环
})
process.send('send msg to parent')
// 进程不一样,完全独立，本质也是调用spawn


//spawn 用法
//spawn: 流式的，没有回调，适合耗时任务(比如：npm install), 需要不断打印日志(不断给用户输出日志
cp.spawn(file, args, options) // 不支持回调, exec,execFile底层都是spwan
const childProcess = cp.spawn(path.resolve(__dirname, 'test.shell'), ['-al', '-bl'], {
  cwd: path.resolve('..'),
}) // 返回的是子进程
console.log(childProcess.pid, childProcess.pid)
// 监听成功
childProcess.stdout.on('data', function(chunk) {
  console.log(chunk.toString())
})
// 监听失败
childProcess.stderr.on('data', function(chunk) {
  console.log(chunk.toString())
})

const code = `require('${rootFile}').call(null, ${JSON.stringify(args)})`
 // cp.spawn('cmd', ['/c', 'node', '-e', code]) // win下是这种结构
 const childProcess = spawn('node', ['-e', code], {
   cwd: process.cwd(), // 当前执行未知的cwd
   stdio: 'inherit', // 默认是pipe,pipe必须通过on来接收信息，inherit不需要，实时反馈
 })
 childProcess.on('error', e => {
   log.error(e.message)
   process.exit(1)
 })
childProcess.on('exit', e => {
  log.verbose('命令执行成功', e)
  process.exit(e)
})
```



### 五. 添加组件指令

#### 5.1. 封装ejs模板

组件模块如下：

```
<%_ if(data) { _%>
<template>
  <div class="<%= data.lowerName %>">
    <h2>{{ message }}</h2>
  </div>
</template>

<script>
  export default {
    name: "<%= data.name %>",
    components: {

    },
    mixins: [],
    props: {

    },
    data: function() {
      return {
        message: "Hello <%= data.name %>"
      }
    },
    created: function() {

    },
    mounted: function() {

    },
    computed: {

    },
    methods: {

    }
  }
</script>

<style scoped>
  .<%= data.lowerName %> {
    
  }
</style>

<%_ } _%>
```

路由模板：

- 组件模板，直接使用上面的即可
- router.js模板

```
<%_ if (data) { _%>
// 普通加载路由
// import <%= data.name %> from './<%= data.name %>.vue'
// 懒加载路由
const <%= data.name %> = () => import('./<%= data.name %>.vue')
export default {
  path: '/<%= data.lowerName %>',
  name: '<%= data.name %>',
  component: <%= data.name %>,
  children: [
  ]
}
<%_ } _%>
```

vuex模块的模板

- index.js模板
- types.js模板

index.js模块

```
import * as types from './types.js'
export default {
  namespaced: true,
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters: {
  }
}
```

types.js模块

```
export {
  
}
```

#### 5.2. 封装ejs解析

封装ejs的编译过程：

```
const ejsCompile = (templatePath, data={}, options = {}) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(templatePath, {data}, options, (err, str) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(str);
    })
  })
}
```

封装创建文件夹的过程：

```
const mkdirSync = (dirname) => {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    // 不存在,判断父亲文件夹是否存在？
    if (mkdirSync(path.dirname(dirname))) {
      // 存在父亲文件，就直接新建该文件
      fs.mkdirSync(dirname)
      return true
    }
  }
}
```

封装写入文件的过程：

```
const writeFile = (path, content) => {
  if (fs.existsSync(path)) {
    log.error("the file already exists~")
    return;
  }
  return fs.promises.writeFile(path, content);
}
```

封装ejs到文件的转化过程：

```
const handleEjsToFile = async (name, dest, template, filename) => {
  // 1.获取模块引擎的路径
  const templatePath = path.resolve(__dirname, template);
  const result = await ejsCompile(templatePath, {name, lowerName: name.toLowerCase()});

  // 2.写入文件中
  // 判断文件不存在,那么就创建文件
  mkdirSync(dest);
  const targetPath = path.resolve(dest, filename);
  writeFile(targetPath, result);
}
```

#### 5.3. 创建添加指令

添加指令

```
program
  .command('addcpn <name>')
  .description('add vue component, 例如: coderwhy addcpn NavBar [-d src/components]')
  .action(name => addComponent(name, program.dest || 'src/components'))

program
  .command('addpage <name>')
  .description('add vue page, 例如: coderwhy addpage Home [-d dest]')
  .action(name => {
  addPage(name, program.dest || `src/pages/${name.toLowerCase()}`)
})

program
  .command('addstore <name>')
  .description('add vue store, 例如: coderwhy addstore favor [-d dest]')
  .action(name => {
  addStore(name, program.dest || `src/store/modules/${name.toLowerCase()}`)
})
```

封装对应的action

```
const addComponent = async (name, dest) => {
  handleEjsToFile(name, dest, '../template/component.vue.ejs', `${name}.vue`);
}

const addPage = async (name, dest) => {
  addComponent(name, dest);
  handleEjsToFile(name, dest, '../template/vue-router.js.ejs', 'router.js')
}

const addStore = async (name, dest) => {
  handleEjsToFile(name, dest, '../template/vue-store.js.ejs', 'index.js')
  handleEjsToFile(name, dest, '../template/vue-types.js.ejs', 'types.js')
}
```

### 六. 发布工具

注册npm账号：

- https://www.npmjs.com/
- 选择sign up

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXuvsfCKCtp2lQ6qFNLhNLWZicFXVpMZmib38NiaDoibicwJyAY4TJOGiaGHtMicVRibkb1zkwYFtAZsPgKma1Q/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)sign up注册

在命令行登录：

```
npm login
# 输入账号、密码、邮箱
```

修改好package.json文件：

```
  "keywords": [
    "vue",
    "react",
    "CLI",
    "component"
  ],
  "author": "coderwhy",
  "license": "MIT",
  "homepage": "https://github.com/coderwhy/coderwhy",
  "repository": {
    "type": "git",
    "url": "https://github.com/coderwhy/coderwhy"
  },
```

发布到npm registry中

```
npm publish
```

更新registry

```
# 1.修改版本号(最好符合semver规范)
# 2.重新发布
```

删除发布的包：

```
npm unpublish
```

过期发布的包：

```
npm deprecate
```
