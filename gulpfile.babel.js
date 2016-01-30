import 'babel-polyfill';
import dotenv from 'dotenv';
import ps from 'ps-node';
import running from 'is-running';
import gulp from 'gulp';
import del from 'del';
import fs from 'fs';
import path from 'path';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import gulpFilter from 'gulp-filter';
import webpack from 'webpack-stream';
import sourcemaps from 'gulp-sourcemaps';
import inlinesource from 'gulp-inline-source';
import eslint from 'gulp-eslint';
import jscs from 'gulp-jscs';
import flow from 'gulp-flowtype';
import scsslint from 'gulp-scss-lint';
import htmlhint from 'gulp-htmlhint';
import uglify from 'gulp-uglify';
import htmlmin from 'gulp-htmlmin';
import { Server as KarmaServer } from 'karma';
import mocha from 'gulp-mocha';
import webserver from 'gulp-webserver';

dotenv.config({
  path: path.join(__dirname, '.env'),
});

const isProductionEnv = process.env.NODE_ENV === 'production';

function getWebpackConfig() {
  try {
    return require('./webpack.demo.config.babel.js');
  } catch (ex) {
    return require('./webpack.config.babel.js');
  }
}

function buildBaseApp(myWebpackConfig) {
  return gulp.src(['src/**/*.js', 'containers/**/*.js'])
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(webpack(myWebpackConfig))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/static/'));
}

function buildApp(myWebpackConfig) {
  const jsFilter = gulpFilter(['**/*.js']);
  return buildBaseApp(myWebpackConfig)
    .pipe(jsFilter)
    .pipe(uglify())
    .pipe(rename({
      suffix: '_min',
    }))
    .pipe(gulp.dest('public/static/'));
}

function buildHTML() {
  const revData = JSON.parse(fs.readFileSync('rev-version.json'));
  let stream = gulp.src('containers/**/*.html')
    .pipe(replaceRev(revData))
    .pipe(inlinesource({
      rootpath: path.join(__dirname, 'public'),
    }));
  if (isProductionEnv) {
    stream = stream.pipe(htmlmin({ // https://github.com/kangax/html-minifier
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeTagWhitespace: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      useShortDoctype: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeCDATASectionsFromCDATA: true,
    }));
  }
  return stream.pipe(gulp.dest('public'));
}

function replaceRev(revData) {
  const RE_JS_FILE = /(<script\s[^>]*src=)['"](.+?)['"]/g;
  const RE_ADD_MIN = /^(.+?)\.(.+)$/;
  return replace(RE_JS_FILE, ($0, $1, $2) => {
    const filename = $2.replace(/.*\//, '');
    let res = revData;
    filename.split('.').forEach(function (name) {
      res = typeof res === 'object' && res[name] || $2;
    });
    if (isProductionEnv) {
      res = res.replace(RE_ADD_MIN, '$1_min.$2');
    }
    return `${$1}"${res}"`;
  });
}

function testFunctional() {
  return gulp.src(['tests/functionals/**/*.js'], { read: false })
    // gulp-mocha needs filepaths so you can't have any plugins before it
    .pipe(mocha({ // https://www.npmjs.com/package/gulp-mocha
      reporter: 'spec',
      globals: [],
    }));
}

function killLastServer(done) {
  fs.stat('.devserver.pid', function (err) {
    if (err) {
      done();
      return;
    }
    const lastPid = parseInt(fs.readFileSync('.devserver.pid').toString(), 10);
    ps.lookup({ pid: lastPid }, function (err, resultList) {
      if (err) {
        done();
        return;
      }
      const process = resultList[0];
      if (process && running(process.pid)) {
        ps.kill(process.pid, done);
      } else {
        done();
      }
    });
  });
}

function startDevServer(stream, done) {
  fs.writeFileSync('.devserver.pid', process.pid);
  stream.pipe(webserver({ // https://www.npmjs.com/package/gulp-webserver#options
    port: process.env.MYAPP_DEVSERVER_PORT || 8000,
    host: process.env.MYAPP_DEVSERVER_HOST || 'localhost',
  }));
  done();
}

gulp.task('clean:app', (done) => {
  del(['public/static/**']).then(() => done());
});

gulp.task('clean:html', (done) => {
  del(['public/**/*.html']).then(() => done());
});

gulp.task('check:css', [], () => {
  return gulp.src(['src/**/*.scss', 'containers/**/*.scss'])
    .pipe(scsslint())
    .pipe(scsslint.failReporter());
});

gulp.task('check:js', [], () => {
  return gulp.src(['src/**/*.@(js|jsx)', 'containers/**/*.@(js|jsx)'])
    .pipe(eslint())
    .pipe(eslint.format('stylish'))
    .pipe(eslint.failAfterError())
    .pipe(jscs())
    .pipe(jscs.reporter('console'))
    .pipe(jscs.reporter('failImmediately'))
    .pipe(flow({ // https://www.npmjs.com/package/gulp-flowtype#options
      all: false,
      weak: false,
      declarations: './src/declarations',
      killFlow: false,
      beep: true,
      abort: true,
    }));
});

gulp.task('check:html', [], () => {
  return gulp.src('containers/**/*.html')
    .pipe(htmlhint('.htmlhintrc')) // https://github.com/yaniswang/HTMLHint/wiki/Rules
    .pipe(htmlhint.failReporter());
});

gulp.task('check:all', ['check:js', 'check:css', 'check:html'], () => {});

gulp.task('test:unit', [], (done) => {
  new KarmaServer({
    configFile: `${__dirname}/karma.conf.js`,
    singleRun: true,
  }, done).start();
});

gulp.task('test:functional', [], testFunctional);

gulp.task('test:all', ['test:unit', 'test:functional'], () => {});

gulp.task('update:app', ['clean:app', 'test:unit'], () => {
  return buildBaseApp(getWebpackConfig());
});

gulp.task('build:app', ['clean:app', 'check:all', 'test:unit'], () => {
  return buildApp(getWebpackConfig());
});

gulp.task('build:html', ['clean:html', 'build:app'], buildHTML);

gulp.task('test:afterBuild', ['build:html'], testFunctional);

gulp.task('build', [
  'test:afterBuild',
]);

gulp.task('deploy', [
  'test:afterBuild',
]);

gulp.task('default', [
  'build',
]);

gulp.task('watch:src', () => {
  gulp.watch(['src/**'], ['update:app']);
  gulp.watch(['containers/**', 'data/**'], ['build:html']);
  gulp.watch(['tests/units/**'], ['test:unit']);
  gulp.watch(['tests/functionals/**'], ['test:functional']);
});

gulp.task('watch:server', () => {
  gulp.watch(['src/**'], ['test:afterBuild']);
  gulp.watch(['containers/**'], ['test:afterBuild']);
  gulp.watch(['tests/units/**'], ['test:unit']);
  gulp.watch(['tests/functionals/**'], ['test:functional']);
});

gulp.task('serve:start', (done) => {
  const stream = gulp.src('public');
  killLastServer(function () {
    startDevServer(stream, done);
  });
});

gulp.task('serve:stop', (done) => {
  killLastServer(done);
});
