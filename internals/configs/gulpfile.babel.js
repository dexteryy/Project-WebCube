// import 'babel-polyfill';
import running from 'is-running';
import gulp from 'gulp';
import gulpif from 'gulp-if';
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
// import flow from 'gulp-flowtype';
import sassLint from 'gulp-sass-lint';
import styleLint from 'gulp-stylelint';
import htmlhint from 'gulp-htmlhint';
import uglify from 'gulp-uglify';
import htmlmin from 'gulp-htmlmin';
import { Server as KarmaServer } from 'karma';
import mocha from 'gulp-mocha';
import staticWebServer from 'gulp-webserver';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
// import express from 'express';
import * as util from '../utils';

const rootPath = path.join(__dirname, '../..');
const pidFile = path.join(rootPath, 'internals/configs/.webserver.pid');
const webpackConfig = require('./webpack.default.config.babel.js');
const compiler = webpack(webpackConfig);
const cloudAdapter = require(`../utils/staticcloud/${process.env.APP_DEPLOY_STATIC_CLOUD}`);

const staticRoot = util.isProductionEnv
  ? process.env.APP_STATIC_ROOT
  : 'static-for-dev';

const devServerConfig = {
  contentBase: path.join(rootPath, 'staticweb'),
  publicPath: util.isCloudEnv
    ? process.env.APP_DEPLOY_STATIC_ROOT
    : `/${staticRoot}/`,
  hot: util.liveMode === 'hmr',
  noInfo: true,
  stats: { colors: true },
  watchOptions: {
    aggregateTimeout: 300,
    poll: true,
  },
};

function buildApp(myWebpackConfig) {
  let stream = gulp.src([
    'app/**/*.js',
    'staticweb/**/*.js',
  ], { cwd: rootPath })
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(webpackStream(myWebpackConfig))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`build/public/${staticRoot}/`, { cwd: rootPath }));
  if (util.isProductionEnv) {
    const jsFilter = gulpFilter(['**/*.js'], { restore: true });
    const cssFilter = gulpFilter(['**/*.css'], { restore: true });
    stream = stream.pipe(jsFilter)
      .pipe(uglify())
      .pipe(rename({
        suffix: '_min',
      }))
      .pipe(gulp.dest(`build/public/${staticRoot}/`, { cwd: rootPath }))
      .pipe(jsFilter.restore)
      .pipe(cssFilter)
      .pipe(rename({
        suffix: '_min',
      }))
      .pipe(gulp.dest(`build/public/${staticRoot}/`, { cwd: rootPath }))
      .pipe(cssFilter.restore);
  }
  return stream;
}

function buildHTML() {
  const revData = JSON.parse(
    fs.readFileSync(
      path.join(rootPath, 'internals/configs/rev-version.json')
    )
  );
  const RE_JS_FILE = /(<script\s[^>]*src=)['"](.+?)['"]/g;
  const RE_CSS_FILE = /(<link\s[^>]*href=)['"](.+?)['"]/g;
  const RE_ADD_MIN = /^(.+\/.+?)\.(.+)$/;
  function replaceRev($0, $1, $2) {
    if (!/^\//.test($2)) {
      return $0;
    }
    const filename = $2.replace(/.*\//, '');
    let res = revData;
    filename.split('.').forEach(function (name) {
      res = typeof res === 'object' && res[name] || $2;
    });
    if (!/\.(js|css)$/.test(res)) {
      return $0;
    }
    if (util.isProductionEnv) {
      res = res.replace(RE_ADD_MIN, '$1_min.$2');
    }
    return `${$1}"${res}"`;
  }
  let stream = gulp.src('staticweb/**/*.html', { cwd: rootPath })
    .pipe(replace(RE_JS_FILE, replaceRev))
    .pipe(replace(RE_CSS_FILE, replaceRev))
    .pipe(inlinesource({
      rootpath: path.join(rootPath, 'build/public'),
    }));
  if (util.isProductionEnv) {
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
  return stream.pipe(gulp.dest('build/public', { cwd: rootPath }));
}

function testFunctional() {
  return gulp.src([
    'app/**/*.spec.js',
    'server/**/*.spec.js',
  ], { cwd: rootPath, read: false })
    // Gulp-mocha needs filepaths so you can't have any plugins before it
    .pipe(mocha({ // https://www.npmjs.com/package/gulp-mocha
      reporter: 'spec',
      globals: [],
    }));
}

function testUnit(done) {
  new KarmaServer({
    configFile: path.join(rootPath, 'internals', 'configs', 'karma.conf.js'),
    singleRun: true,
  }, done).start();
}

function getDevServer() {
  return new WebpackDevServer(compiler, devServerConfig);
}

// function getHotDevServer() {
//   return express()
//     .use(require('webpack-dev-middleware')(compiler, devServerConfig))
//     .use(require('webpack-hot-middleware')(compiler))
//     .get('*', function (req, res) {
//       res.sendFile(path.join(__dirname,
//         'staticweb', req.params[0], 'index.html'));
//     });
// }

function startDevServer() {
  if (util.isProductionEnv) {
    throw new Error('Don\'t use webpack-dev-server for production env');
  }
  // const server = util.liveMode === 'hmr'
  //   ? getHotDevServer() : getDevServer();
  const server = getDevServer();
  server.listen(util.serverPort, util.serverHost, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Listening at http://${util.serverHost}:${util.serverPort}`);
  });
}

function startStaticWebServer(stream, done) {
  fs.writeFileSync(pidFile, process.pid);
  stream.pipe(staticWebServer({
    // https://www.npmjs.com/package/gulp-webserver#options
    port: util.serverPort,
    host: util.serverHost,
  }));
  done();
}

function stopStaticWebServer(done) {
  fs.stat(pidFile, function (err) {
    if (err) {
      return done();
    }
    let lastPid, isRunning;
    try {
      lastPid = parseInt(fs.readFileSync(pidFile).toString(), 10);
      fs.unlinkSync(pidFile);
      isRunning = lastPid && running(lastPid);
    } catch (ex) {
      return done();
    }
    if (isRunning) {
      process.kill(lastPid, 'SIGKILL');
    }
    return done();
  });
}

gulp.task('clean:empty', (done) => {
  del([
    'app/entries/*',
    'app/components/*',
    'app/data/*',
    'app/assets/*',
    'staticweb/*',
  ], { cwd: rootPath }).then(() => {
    gulp.src([
      'env.config',
    ], { cwd: rootPath })
      .pipe(replace(/^APP_ENTRY_EXAMPLE_APP=.*$/, ''))
      .pipe(gulp.dest('./', { cwd: rootPath }))
      .on('end', () => done())
      .on('error', (err) => done(err));
  });
});

gulp.task('clean:app', (done) => {
  del([
    `build/public/${staticRoot}/**`,
    'build/public/static-for-dev/**',
  ], { cwd: rootPath }).then(() => done());
});

gulp.task('clean:html', (done) => {
  del([
    `build/public/!(${staticRoot}|static-for-dev)/**`,
  ], { cwd: rootPath }).then(() => done());
});

gulp.task('check:scss', [], () => {
  return gulp.src([
    'app/**/*.scss',
    'staticweb/**/*.scss',
  ], { cwd: rootPath })
    .pipe(gulpif(!process.env.APP_DISABLE_SASSLINT,
      sassLint({
        configFile: path.join(rootPath, '.sass-lint.yml'),
      })
    ))
    .pipe(gulpif(!process.env.APP_DISABLE_SASSLINT,
      sassLint.format()
    ))
    .pipe(gulpif(!process.env.APP_DISABLE_SASSLINT,
      sassLint.failOnError()
    ))
    .pipe(gulpif(!process.env.APP_DISABLE_STYLELINT,
      styleLint({
        configFile: path.join(rootPath, '.stylelintrc'),
        failAfterError: true,
        reporters: [
           { formatter: 'string', console: true },
        ],
      })
    ));
});

gulp.task('check:css', [], () => {
  return gulp.src([
    'app/**/*.css',
    'staticweb/**/*.css',
  ], { cwd: rootPath })
    .pipe(gulpif(!process.env.APP_DISABLE_STYLELINT,
      styleLint({
        configFile: path.join(rootPath, '.stylelintrc'),
        failAfterError: true,
        reporters: [
           { formatter: 'string', console: true },
        ],
      })
    ));
});

gulp.task('check:js', [], () => {
  return gulp.src([
    'app/**/*.@(js|jsx)',
    'staticweb/**/*.@(js|jsx)',
    'internals/lib/**/*.js',
    'internals/utils/**/*.js',
    'internals/configs/**/*.js',
  ], { cwd: rootPath })
    .pipe(gulpif(!process.env.APP_DISABLE_ESLINT,
      eslint({
        configFile: path.join(rootPath, '.eslintrc.yml'),
      })
    ))
    .pipe(gulpif(!process.env.APP_DISABLE_ESLINT,
      eslint.format('stylish')
    ))
    .pipe(gulpif(!process.env.APP_DISABLE_ESLINT,
      eslint.failAfterError()
    ))
    .pipe(gulpif(!process.env.APP_DISABLE_JSCS,
      jscs({
        configFile: path.join(rootPath, '.jscsrc'),
      })
    ))
    .pipe(gulpif(!process.env.APP_DISABLE_JSCS,
      jscs.reporter('console')
    ))
    .pipe(gulpif(!process.env.APP_DISABLE_JSCS,
      jscs.reporter('failImmediately')
    ));
  // waiting for babel 6.6 upgrade
  // .pipe(flow({ // https://www.npmjs.com/package/gulp-flowtype#options
  //   all: false,
  //   weak: false,
  //   killFlow: false,
  //   beep: true,
  //   abort: true,
  // }));
});

gulp.task('check:html', [], () => {
  return gulp.src('staticweb/**/*.html', { cwd: rootPath })
    .pipe(gulpif(!process.env.APP_DISABLE_HTMLHINT,
      htmlhint({
        // https://github.com/yaniswang/HTMLHint/wiki/Rules
        htmlhintrc: path.join(rootPath, '.htmlhintrc'),
      })
    ))
    .pipe(gulpif(!process.env.APP_DISABLE_HTMLHINT,
      htmlhint.failReporter()
    ));
});

gulp.task('check:all', [
  'check:js',
  'check:scss',
  'check:css',
  'check:html',
], () => {});

gulp.task('test:unit', [], testUnit);

gulp.task('test:functional', [], testFunctional);

gulp.task('test:all', ['test:functional', 'test:unit'], () => {});

gulp.task('update:app', ['clean:app'], () => {
  return buildApp(webpackConfig);
});

gulp.task('build:app', ['clean:app', 'check:all'], () => {
  return buildApp(webpackConfig);
});

gulp.task('update:html', ['clean:html'], buildHTML);

gulp.task('build:html', ['clean:html', 'build:app'], buildHTML);

gulp.task('test:afterBuild', ['build:html'], testFunctional);

gulp.task('build', [
  'test:afterBuild',
]);

gulp.task('deploy:html', [
  'build:html',
], cloudAdapter.deployHTML([
  `build/public/!(${staticRoot})/**/*.html`,
], { cwd: rootPath }));

gulp.task('deploy:static', [
  'build:html',
], cloudAdapter.deployStatic([
  `build/public/${staticRoot}/**/*`,
], { cwd: rootPath }));

gulp.task('redeploy:html', [
], cloudAdapter.deployHTML([
  `build/public/!(${staticRoot})/**/*.html`,
], { cwd: rootPath }));

gulp.task('redeploy:static', [
], cloudAdapter.deployStatic([
  `build/public/${staticRoot}/**/*`,
], { cwd: rootPath }));

gulp.task('deploy:staticweb', [
  'deploy:html',
  'deploy:static',
], () => {});

gulp.task('redeploy:staticweb', [
  'redeploy:html',
  'redeploy:static',
], () => {});

gulp.task('watch:dev', ['clean:html', 'stop:staticserver'], startDevServer);

gulp.task('start:staticserver', (done) => {
  const stream = gulp.src('build/public', { cwd: rootPath });
  stopStaticWebServer(function () {
    startStaticWebServer(stream, done);
  });
});

gulp.task('stop:staticserver', (done) => {
  stopStaticWebServer(done);
});

gulp.task('default', [
  'build',
]);
