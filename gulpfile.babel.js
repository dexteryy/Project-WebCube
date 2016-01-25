import 'babel-polyfill';
import gulp from 'gulp';
import del from 'del';
import rename from 'gulp-rename';
import gulpFilter from 'gulp-filter';
import webpack from 'webpack-stream';
import sourcemaps from 'gulp-sourcemaps';
import inlinesource from 'gulp-inline-source';
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
  const jsFilter = gulpFilter(['**/*.js']);
  return buildApp()
    .pipe(jsFilter)
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

gulp.task('build:html', ['clean:html', 'build:app'], () => {
  return buildHTML();
});

gulp.task('prod:html', ['clean:html', 'prod:app'], () => {
  return buildHTML();
});

function buildHTML() {
  return gulp.src('containers/**/*.html')
    .pipe(inlinesource())
    .pipe(gulp.dest('public'));
}

gulp.task('default', [
  'prod:app',
  'prod:html',
]);

gulp.task('watch', () => {
  gulp.watch(['src/**'], ['build:app']);
  gulp.watch(['containers/**/*.html'], ['build:html']);
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
