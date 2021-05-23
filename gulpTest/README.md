<!--
 * @Description: 
 * @version: 
 * @Author: hmlhml
 * @Date: 2021-05-21 10:36:04
 * @LastEditors: hmlhml
-->
## gulp
基于stream流的自动化构建工具

## 1、项目目录结构
    gulpTest
    ├── css
    │   └── index.scss
    ├── js
    │   └── index.js
    ├── dist
    │   ├── css
    │   │   └── index.css
    │   └── js
    │       └── index.js
    ├── gulpfile.js
    ├── index.html
    ├── package.json


## 2、gulpfile.js文件配置

```javascript
const { src, dest, series, watch } = require("gulp");

//页面实时刷新
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;

// 使用 gulp-load-plugins后，可以plugins.sass 来代替 require("gulp-sass")
const plugins = require("gulp-load-plugins")();

// 删除文件
const del = require("del");

// 处理css任务
function css(cb) {
src("css/*.scss")
    .pipe(plugins.sass({ outputStyle: "compressed" })) // 压缩
    .pipe(plugins.autoprefixer({ cascade: false, remove: false })) // 添加css前缀，要配合browserslist使用
    .pipe(dest("./dist/css"))
    .pipe(reload({ stream: true })); // 修改之后自动刷新
cb();
}

// 处理js任务
function js(cb) {
src("js/*.js")
    .pipe(plugins.uglify()) // 压缩
    .pipe(dest("./dist/js"))
    .pipe(reload({ stream: true })); // 修改之后自动刷新
cb();
}

// 删除dist目录任务
function clean(cb) {
    del("./dist");
    cb();
}

// 监听这些文件的变化
function watcher() {
    watch("js/*.js", js);
    watch("css/*.scss", css);
}

// server任务
function server(cb) {
    browserSync.init({
        server: {
        baseDir: "./",
        },
    });
    cb();
}
exports.style = css;
exports.script = js;
exports.clean = clean;
exports.watcher = watcher;

// 执行任务链
exports.default = series([clean, js, css, server, watcher]);
```
## 3、执行任务
`gulp --tasks` 查看所有任务  
`gulp taskName` 执行taskName任务  
`gulp` 执行default任务  
 
 ## 4、package.json配置
 ```json
 {
  "name": "gulpTest",
  "version": "1.0.0",
  "description": "",
  "main": "gulpfile.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "gulp"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "browser-sync": "^2.26.14",
    "del": "^6.0.0",
    "gulp": "^4.0.2",
    "gulp-autoprefixer": "^7.0.1",
    "gulp-load-plugins": "^2.0.6",
    "gulp-sass": "^4.1.0",
    "gulp-uglify": "^3.0.2"
  },
  "browserslist": [
    "last 2 version",
    "> 2%"
  ]
}
```

## 5、browserslist特别说明
> browserslist 是在不同的前端工具之间共用目标浏览器和 node 版本的配置工具

browserslist单独使用没有意义，主要与下列工具搭配使用
* Autoprefixer
* Babel
* postcss-preset-env
* eslint-plugin-compat
* stylelint-no-unsupported-browser-features
* postcss-normalize

> browserslist字段会被 @babel/preset-env 和 Autoprefixer 用来确定需要转译的 JavaScript 特性和需要添加的 CSS 浏览器前缀。


### a、使用方法
1.在package.json中配置
```json
{
  "browserslist": [
    "last 1 version",
    "> 1%",
    "maintained node versions",
    "not dead"
  ]
}
```
2.在.browerslistrc文件中配置
```
# 注释是这样写的，以#号开头
last 1 version
> 1%
maintained node versions
not dead
```
#### b、常见查询条件
* `last 2 versions` : 每个浏览器最近的两个版本。
* `last 2 Chrome versions` : chrome 浏览器最近的两个版本。
* `> 5%`: 基于全球使用率统计而选择的浏览器版本范围。>=,<,<=同样适用。
* `maintained node versions` : 所有还被 node 基金会维护的 node 版本。*
