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
import webpackStream from 'webpack-stream';
import sourcemaps from 'gulp-sourcemaps';
import inlinesource from 'gulp-inline-source';
import eslint from 'gulp-eslint';
import jscs from 'gulp-jscs';
import flow from 'gulp-flowtype';
import sassLint from 'gulp-sass-lint';
import cssLint from 'gulp-csslint';
import htmlhint from 'gulp-htmlhint';
import uglify from 'gulp-uglify';
import htmlmin from 'gulp-htmlmin';
import { Server as KarmaServer } from 'karma';
import mocha from 'gulp-mocha';
import webserver from 'gulp-webserver';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import express from 'express';

dotenv.config({
  path: path.join(__dirname, '.env'),
});

const isProductionEnv = process.env.NODE_ENV === 'production';
const liveMode = (process.env.LIVE_MODE || '').toLowerCase();
const serverPort = process.env.MYAPP_SERVER_PORT || 8000;
const serverHost = process.env.MYAPP_SERVER_HOST || 'localhost';
const pidFile = path.join(__dirname, '.webserver.pid');

const compiler = webpack(getWebpackConfig());

const devServerConfig = {
  contentBase: 'containers',
  publicPath: isProductionEnv
    ? process.env.MYAPP_CDN_PREFIX
    : '/static/',
  hot: liveMode === 'hmr',
  noInfo: true,
  stats: { colors: true },
  watchOptions: {
    aggregateTimeout: 300,
    poll: true,
  },
};

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
    .pipe(webpackStream(myWebpackConfig))
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
  return gulp.src(['test/functionals/**/*.js'], { read: false })
    // gulp-mocha needs filepaths so you can't have any plugins before it
    .pipe(mocha({ // https://www.npmjs.com/package/gulp-mocha
      reporter: 'spec',
      globals: [],
    }));
}

function getDevServer() {
  return new WebpackDevServer(compiler, devServerConfig);
}

function getHotDevServer() {
  return express()
    .use(require('webpack-dev-middleware')(compiler, devServerConfig))
    .use(require('webpack-hot-middleware')(compiler))
    .get('*', function (req, res) {
      res.sendFile(path.join(__dirname,
        'containers', req.params[0], 'index.html'));
    });
}

function startDevServer() {
  if (isProductionEnv) {
    throw new Error('Don\'t use webpack-dev-server for production env');
  }
  const server = liveMode === 'hmr' ? getHotDevServer() : getDevServer();
  server.listen(serverPort, serverHost, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Listening at http://${serverHost}:${serverPort}`);
  });
}

function startWebServer(stream, done) {
  fs.writeFileSync(pidFile, process.pid);
  stream.pipe(webserver({ // https://www.npmjs.com/package/gulp-webserver#options
    port: serverPort,
    host: serverHost,
  }));
  done();
}

function stopWebServer(done) {
  fs.stat(pidFile, function (err) {
    if (err) {
      done();
      return;
    }
    const lastPid = parseInt(fs.readFileSync(pidFile).toString(), 10);
    fs.unlinkSync(pidFile);
    if (!lastPid || !running(lastPid)) {
      done();
      return;
    }
    ps.kill(lastPid, function () {
      done();
    });
  });
}

gulp.task('clean:app', (done) => {
  del(['public/static/**']).then(() => done());
});

gulp.task('clean:html', (done) => {
  del(['public/**/*.html']).then(() => done());
});

gulp.task('check:scss', [], () => {
  return gulp.src(['src/**/*.scss', 'containers/**/*.scss'])
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('check:css', [], () => {
  return gulp.src(['src/**/*.css', 'containers/**/*.css'])
    .pipe(cssLint('.csslintrc'))
    .pipe(cssLint.reporter())
    .pipe(cssLint.reporter('fail'));
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

gulp.task('check:all', ['check:js', 'check:scss', 'check:css', 'check:html'], () => {});

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

gulp.task('update:html', ['clean:html'], buildHTML);

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

gulp.task('watch:dev', ['clean:html', 'server:stop'], startDevServer);

gulp.task('watch:units', () => {
  gulp.watch(['src/**'], ['test:unit']);
  gulp.watch(['test/units/**'], ['test:unit']);
});

gulp.task('watch:all', () => {
  if (process.env.NODE_ENV !== 'production') {
    gulp.watch(['src/**'], ['update:app']);
    gulp.watch(['containers/**/*.!(html)', 'data/**'], ['update:app']);
    gulp.watch(['containers/**/*.html'], ['update:html']);
  } else {
    gulp.watch(['src/**'], ['test:afterBuild']);
    gulp.watch(['containers/**'], ['test:afterBuild']);
  }
  gulp.watch(['test/units/**'], ['test:unit']);
  gulp.watch(['test/functionals/**'], ['test:functional']);
});

gulp.task('server:start', (done) => {
  const stream = gulp.src('public');
  stopWebServer(function () {
    startWebServer(stream, done);
  });
});

gulp.task('server:stop', (done) => {
  stopWebServer(done);
});
