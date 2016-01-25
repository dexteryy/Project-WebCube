import 'babel-polyfill';
import gulp from 'gulp';
import del from 'del';
import rename from 'gulp-rename';
import through from 'through2';
import webpack from 'webpack-stream';
import sourcemaps from 'gulp-sourcemaps';
import eslint from 'gulp-eslint';
import jscs from 'gulp-jscs';
import flow from 'gulp-flowtype';
import uglify from 'gulp-uglify';
import webserver from 'gulp-webserver';

gulp.task('clean:app', (done) => {
  del(['public/static/**']).then(() => done());
});

gulp.task('clean:html', (done) => {
  del(['public/**/*.html']).then(() => done());
});

gulp.task('check:js', [], () => {
  return gulp.src(['src/**/*.js', 'src/**/*.jsx'])
    .pipe(eslint())
    .pipe(eslint.format('stylish'))
    .pipe(eslint.failAfterError())
    .pipe(jscs())
    .pipe(jscs.reporter('console'))
    .pipe(jscs.reporter('failImmediately'))
    .pipe(flow({
      all: false,
      weak: false,
      declarations: './src/declarations',
      killFlow: false,
      beep: true,
      abort: true,
    }));
});

gulp.task('build:app', ['clean:app'], () => {
  return buildApp();
});

gulp.task('prod:app', ['clean:app', 'check:js'], () => {
  return buildApp()
    .pipe(through.obj(function (file, enc, cb) {
      const isJS = /\.js$/.test(file.path);
      if (isJS) {
        this.push(file);
      }
      cb();
    }))
    .pipe(uglify())
    .pipe(rename({
      suffix: '_min',
    }))
    .pipe(gulp.dest('public/static/'));
});

function buildApp() {
  let webpackConfig;
  try {
    webpackConfig = require('./webpack.demo.config.js');
  } catch (ex) {
    webpackConfig = require('./webpack.config.js');
  }
  return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(webpack(webpackConfig))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/static/'));
}

gulp.task('build:html', ['clean:html'], () => {
  gulp.src('examples/**/*.html')
    .pipe(gulp.dest('public'));
});

gulp.task('default', [
  'prod:app',
  'build:html',
]);

gulp.task('watch', () => {
  gulp.watch(['src/**'], ['build:app']);
  gulp.watch(['examples/**/*.html'], ['build:html']);
});

gulp.task('webserver', () => {
  gulp.src('public')
    .pipe(webserver({
      // livereload: true,
      // directoryListing: true,
      // open: true,
      port: 8000,
      host: 'localhost',
    }));
});
