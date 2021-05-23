
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