## 一、Yeoman简介

> Yeoman是现代化前端项目的脚手架工具，用于生成包含指定框架结构的工程化目录结构。  
主要通过`yo`这个命令来构建一个完整的项目。  

通过官方的生成器`yeoman-generator`，他们建立了一个Yeoman的工作流。  
**过脚手架工具（yo），构建工具（grunt gulp等）和包管理器（npm bower等）的配合使用让开发者专注于业务的逻辑。**

### yeoman-generator生成器的钩子函数

* initializing - 初始化开始
* prompting - 调用this.prompt()与用户产生交互
* configuring - 创建配置文件(package.json，config.js等)
* default - 方法都不匹配这些优先级时，就会是default优先级（自定义方法会被划入default）
* writing - 创建项目文件
* conflicts - 文件创建中产生冲突的处理
* install - 调用(npm, bower)包install
* end - 最后调用，做一些clean工作

## 二、基于Yeoman开发gulp项目脚手架

### 1、全局安装yo和generator-generator

```shell
npm install -g yo    
npm install generator-generator -g 
```

### 2、运行generator-generator来创建我们自己需要的generator的基础框架
```shell
yo generator
```
配置下列选项
```shell
⚙ hmlhml@localhost  ~/Documents/test  yo generator
? Your generator name generator-mygulp
Your generator must be inside a folder named generator-mygulp
I'll automatically create this folder.
? Description my gulp scaffold
? Project homepage url
? Author's Name hmlhml
? Author's Email 405185142@qq.com
? Author's Homepage
? Package keywords (comma to split) gulp
? Send coverage reports to coveralls Yes
? Enter Node versions (comma separated) 14.15
? GitHub username or organization hmlhml
? Which license do you want to use? MIT
```

我们得到了generator-mygulp的目录：

    generator-mygulp
    ├── LICENSE
    ├── README.md
    ├── __tests__
    │   └── app.js
    ├── generators
    │   └── app
    │       ├── index.js
    │       └── templates
    │           └── dummyfile.txt
    ├── node_modules
    ├── package-lock.json
    └── package.json


### 3、准备模版
将上templates内部替换为一个gulpTest项目里的文件

    templates
    ├── css
    │   └── index.scss
    ├── gulpfile.js
    ├── index.html
    ├── js
    │   └── index.js
    └── package.json

### 4、编辑indexjs

```javascript
'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the primo ${chalk.red('generator-mygulp')} generator!`
      )
    );

    const prompts = [
      {
        type: 'confirm',
        name: 'install',
        message: 'Would you like to enable this option?',
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath('**'),   // 将templates里所有的内容拷贝
      this.destinationPath('./') // 到当前目录
    );
  }

  install() {
    this.installDependencies();
  }
};

```

### 5、npm link
`npm link`命令可以将一个任意位置的npm包链接到全局执行环境，从而在任意位置使用命令行都可以直接运行该npm包

```shell
npm link
```
查看全局npm安装目录，会发现generator-mygulp
```shell
⚙ hmlhml@localhost  /usr/local/lib/node_modules/npm/bin  cd /usr/local/lib/node_modules/
⚙ hmlhml@localhost  /usr/local/lib/node_modules  ls
yarn        @vue           generator-mygulp    npm           yo
```

### 6、使用我们的脚手架

```shell
mkdir test-mygulp && cd test-myapp
yo mygulp

     _-----_     ╭──────────────────────────╮
    |       |    │   Welcome to the primo   │
    |--(o)--|    │     generator-mygulp     │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |     
   __'.___.'__   
 ´   `  |° ´ Y ` 

    ? Would you like to enable this option? Yes
    create package.json
    create gulpfile.js
    create index.html
    create css/index.scss
    create js/index.js
```




## 三、发布到npm上

### 1、发布
> 备注：因为generator-mygulp包名重复了，我改成了generator-mygulp-hml

```shell
npm login
npm publish
```

出现如下内容代表发布成功，也可以登陆npm查看自己packages
```shell
hmlhml@MacBook-Pro  ~/Documents/test/generator-mygulp   master  npm publish
npm notice 
npm notice 📦  generator-mygulp-hml@1.0.0
npm notice === Tarball Contents === 
npm notice 6.1kB generators/.DS_Store                   
npm notice 6.1kB generators/app/.DS_Store               
npm notice 6.1kB generators/app/templates/.DS_Store     
npm notice 1.1kB LICENSE                                
npm notice 491B  generators/app/templates/index.html    
npm notice 1.4kB generators/app/templates/gulpfile.js   
npm notice 997B  generators/app/index.js                
npm notice 19B   generators/app/templates/js/index.js   
npm notice 532B  generators/app/templates/package.json  
npm notice 1.5kB package.json                           
npm notice 1.4kB README.md                              
npm notice 182B  generators/app/templates/css/index.scss
npm notice === Tarball Details === 
npm notice name:          generator-mygulp-hml                    
npm notice version:       1.0.0                                   
npm notice package size:  4.4 kB                                  
npm notice unpacked size: 26.0 kB                                 
npm notice shasum:        f19c1d74aaff93d68c2d0a6601ecc261641001af
npm notice integrity:     sha512-lVCcUDIpDq23N[...]EnQ6GsUj6AvpA==
npm notice total files:   12                                      
npm notice 
```

### 2、使用脚手架
```shell
npm install -g yo
npm install -g generator-mygulp-hml
mkdir project && cd project
yo mygulp-hml
```
