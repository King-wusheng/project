const gulp = require('gulp')
const server = require('gulp-webserver')
const sass = require('gulp-sass')
const webpack = require('webpack-stream')
const watch = require('gulp-watch')
const proxy = require('http-proxy-middleware')

gulp.task("copyhtml",()=>{
    return gulp.src("./src/*.html")
    .pipe(gulp.dest("./dev/"))
})
gulp.task('copyicons', () => {
    return gulp.src('./src/iconfonts/**/*')
    .pipe(gulp.dest('./dev/iconfonts'))
})

// copy libs
gulp.task('copylibs', () => {
    return gulp.src('./src/libs/**/*')
    .pipe(gulp.dest('./dev/libs'))
})

// copy mock
gulp.task('copymock', () => {
    return gulp.src('./src/mock/**/*')
    .pipe(gulp.dest('./dev/mock'))
})


// CommonJS规范做JS模块化
gulp.task('copyjs', () => {
    return gulp.src('./src/scripts/*.js')
      .pipe(webpack({
        mode: 'development',
        entry: {
          app: ['@babel/polyfill', './src/scripts/app.js']
        },
        output: {
          filename: 'app.js'
        },
        module: {
          rules: [
            {
              test: /\.html$/,
              use: [ 'string-loader' ]
            },
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                  plugins: ['@babel/plugin-transform-runtime']
                }
              }
            }
          ]
        }
      }))
      .pipe(gulp.dest('./dev/scripts'))
  })




// 编译sass
gulp.task('packscss', () => {
    return gulp.src('./src/styles/app.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./dev/styles'))
})

//启动一个web-server
gulp.task("server",()=>{
    return gulp.src("./dev")
    .pipe(server({
        host:"localhost",
        port:"5555"
    }))
})

// copy libs
gulp.task('copylibs', () => {
    return gulp.src('./src/libs/**/*')
      .pipe(gulp.dest('./dev/libs'))
})

//监听
gulp.task("watch",()=>{
    gulp.watch("./src/*.html",["copyhtml"])
    watch('./src/styles/**/*', () => {
        gulp.start(['packscss'])
    })
    gulp.watch('./src/libs/**/*', () => {y
        gulp.start(['copylibs'])
    })
    gulp.watch('./src/scripts/**/*', ['copyjs'])
})

gulp.task("default",["copyhtml","server","packscss","copymock","copylibs","copyicons","watch","copyjs"],()=>{
    console.log("work")
})