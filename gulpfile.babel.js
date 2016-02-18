import 'babel-polyfill';
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
import styleLint from 'gulp-stylelint';
import styleLintFailReporter from 'gulp-stylelint-fail-reporter';
import styleLintConsoleReporter from 'gulp-stylelint-console-reporter';
import htmlhint from 'gulp-htmlhint';
import uglify from 'gulp-uglify';
import htmlmin from 'gulp-htmlmin';
import { Server as KarmaServer } from 'karma';
import mocha from 'gulp-mocha';
import webserver from 'gulp-webserver';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
// import express from 'express';

const util = require('./utils');
const pidFile = path.join(__dirname, 'configs', '.webserver.pid');
let webpackConfig;
try {
  webpackConfig = require('./configs/webpack.demo.config.babel.js');
} catch (ex) {
  webpackConfig = require('./configs/webpack.default.config.babel.js');
}
const compiler = webpack(webpackConfig);
const cloudAdapter = require(`./utils/deploy/${process.env.APP_DEPLOY_STATIC_CLOUD}`);

const devServerConfig = {
  contentBase: path.join('.', 'containers'),
  publicPath: util.isCloudEnv
    ? process.env.APP_DEPLOY_STATIC_ROOT
    : '/static/',
  hot: util.liveMode === 'hmr',
  noInfo: true,
  stats: { colors: true },
  watchOptions: {
    aggregateTimeout: 300,
    poll: true,
  },
};

function buildApp(myWebpackConfig) {
  let stream = gulp.src(['src/**/*.js', 'containers/**/*.js'])
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(webpackStream(myWebpackConfig))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/public/static/'));
  if (util.isProductionEnv) {
    const jsFilter = gulpFilter(['**/*.js'], { restore: true });
    const cssFilter = gulpFilter(['**/*.css'], { restore: true });
    stream = stream.pipe(jsFilter)
      .pipe(uglify())
      .pipe(rename({
        suffix: '_min',
      }))
      .pipe(gulp.dest('build/public/static/'))
      .pipe(jsFilter.restore)
      .pipe(cssFilter)
      .pipe(rename({
        suffix: '_min',
      }))
      .pipe(gulp.dest('build/public/static/'))
      .pipe(cssFilter.restore);
  }
  return stream;
}

function buildHTML() {
  const revData = JSON.parse(fs.readFileSync('./configs/rev-version.json'));
  const RE_JS_FILE = /(<script\s[^>]*src=)['"](.+?)['"]/g;
  const RE_CSS_FILE = /(<link\s[^>]*href=)['"](.+?)['"]/g;
  const RE_ADD_MIN = /^(.+\/.+?)\.(.+)$/;
  function replaceRev($0, $1, $2) {
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
  let stream = gulp.src('containers/**/*.html')
    .pipe(replace(RE_JS_FILE, replaceRev))
    .pipe(replace(RE_CSS_FILE, replaceRev))
    .pipe(inlinesource({
      rootpath: path.join(__dirname, 'build/public'),
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
  return stream.pipe(gulp.dest('build/public'));
}

function testFunctional() {
  return gulp.src(['test/functionals/**/*.js'], { read: false })
    // Gulp-mocha needs filepaths so you can't have any plugins before it
    .pipe(mocha({ // https://www.npmjs.com/package/gulp-mocha
      reporter: 'spec',
      globals: [],
    }));
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
//         'containers', req.params[0], 'index.html'));
//     });
// }

function startDevServer() {
  if (util.isProductionEnv) {
    throw new Error('Don\'t use webpack-dev-server for production env');
  }
  // const server = util.liveMode === 'hmr' ? getHotDevServer() : getDevServer();
  const server = getDevServer();
  server.listen(util.serverPort, util.serverHost, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Listening at http://${util.serverHost}:${util.serverPort}`);
  });
}

function startWebServer(stream, done) {
  fs.writeFileSync(pidFile, process.pid);
  stream.pipe(webserver({ // https://www.npmjs.com/package/gulp-webserver#options
    port: util.serverPort,
    host: util.serverHost,
  }));
  done();
}

function stopWebServer(done) {
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

function deployHTML() {
  return gulp.src(['build/public/!(static)/**/*.html'])
    .pipe(cloudAdapter.deployHTML());
}

function deployStatic() {
  return gulp.src(['build/public/static/**/*'])
    .pipe(cloudAdapter.deployStatic());
}

gulp.task('clean:empty', (done) => {
  del([
    'test/functionals/*',
    'test/units/!(defaults.spec.js)',
    'src/assets/*',
    'src/components/*',
    'src/entries/*',
    'src/models/*',
    'src/utils/*',
    'data/*',
    'containers/*',
    'configs/webpack.demo.config.babel.js',
  ]).then(() => {
    gulp.src(['configs/webpack.default.config.babel.js'])
      .pipe(replace(/\s*app:\s*\[.+?\],/, ''))
      .pipe(gulp.dest('./'))
      .on('end', () => done())
      .on('error', (err) => done(err));
  });
});

gulp.task('clean:app', (done) => {
  del([
    'build/public/static/js/**',
    'build/public/static/css/**',
    'build/public/static/assets/**',
    'build/public/static/data/**',
  ]).then(() => done());
});

gulp.task('clean:html', (done) => {
  del(['build/public/!(static)/**']).then(() => done());
});

gulp.task('check:scss', [], () => {
  return gulp.src(['src/**/*.scss', 'containers/**/*.scss'])
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
    .pipe(styleLint({
      reporters: [
        styleLintConsoleReporter(),
        styleLintFailReporter(),
      ],
    }));
});

gulp.task('check:css', [], () => {
  return gulp.src(['src/**/*.css', 'containers/**/*.css'])
    .pipe(styleLint({
      reporters: [
        styleLintConsoleReporter(),
        styleLintFailReporter(),
      ],
    }));
});

gulp.task('check:js', [], () => {
  return gulp.src(['src/**/*.@(js|jsx)', 'containers/**/*.@(js|jsx)', 'configs/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format('stylish'))
    .pipe(eslint.failAfterError())
    .pipe(jscs())
    .pipe(jscs.reporter('console'))
    .pipe(jscs.reporter('failImmediately'))
    .pipe(flow({ // https://www.npmjs.com/package/gulp-flowtype#options
      all: false,
      weak: false,
      declarations: 'src/declarations',
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
    configFile: path.join(__dirname, 'configs', 'karma.conf.js'),
    singleRun: true,
  }, done).start();
});

gulp.task('test:functional', [], testFunctional);

gulp.task('test:all', ['test:unit', 'test:functional'], () => {});

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
], deployHTML);

gulp.task('deploy:static', [
  'build:html',
], deployStatic);

gulp.task('redeploy:html', [
], deployHTML);

gulp.task('redeploy:static', [
], deployStatic);

gulp.task('deploy:all', [
  'deploy:html',
  'deploy:static',
], () => {});

gulp.task('redeploy:all', [
  'redeploy:html',
  'redeploy:static',
], () => {});

gulp.task('watch:dev', ['clean:html', 'server:stop'], startDevServer);

gulp.task('watch:units', () => {
  gulp.watch(['src/**'], ['test:unit']);
  gulp.watch(['test/units/**'], ['test:unit']);
});

gulp.task('watch:build', () => {
  if (!util.isProductionEnv) {
    gulp.watch(['src/**'], ['update:app']);
    gulp.watch(['containers/**/*.!(html)', 'data/**'], ['update:app']);
    gulp.watch(['containers/**/*.html'], ['update:html']);
  } else {
    gulp.watch(['src/**'], ['test:afterBuild']);
    gulp.watch(['containers/**'], ['test:afterBuild']);
  }
  gulp.watch(['test/functionals/**'], ['test:functional']);
});

gulp.task('server:start', (done) => {
  const stream = gulp.src('build/public');
  stopWebServer(function () {
    startWebServer(stream, done);
  });
});

gulp.task('server:stop', (done) => {
  stopWebServer(done);
});

gulp.task('default', [
  'build',
]);
