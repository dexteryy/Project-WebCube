const fs = require('fs');
const path = require('path');
const del = require('del');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const running = require('is-running');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const gulpFilter = require('gulp-filter');
const webpackStream = require('webpack-stream');
const sourcemaps = require('gulp-sourcemaps');
const inlinesource = require('gulp-inline-source');
const htmlhint = require('gulp-htmlhint');
const uglify = require('gulp-uglify-es').default;
const minify = require('gulp-babel-minify');
const htmlmin = require('gulp-htmlmin');
const staticWebServer = require('superstatic');
const jsonfile = require('jsonfile');
const {
  isProductionEnv,
  serverPort,
  serverHost,
  projectPath,
  modulePath,
  staticRoot,
  cloudAdapter,
} = require('../utils');
//
const webpackConfig = require('./webpack.config.js');

const pidFile = path.join(projectPath, '.webserver.pid');

try {
  require(path.join(
    projectPath,
    `${process.env.WEBCUBE_CUSTOM_CONFIG_ROOT}/gulpfile.js`
  ));
} catch (ex) {
  console.info('No custom gulpfile');
}

const htmlhintrcPath = path.join(projectPath, 'staticweb/.htmlhintrc');

function buildApp(myWebpackConfig) {
  let stream = gulp
    .src(['app/**/*.js', 'staticweb/**/*.js'], { cwd: projectPath })
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(webpackStream(myWebpackConfig))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`build/public/${staticRoot}/`, { cwd: projectPath }));
  if (isProductionEnv) {
    const jsFilter = gulpFilter(['**/*.js'], { restore: true });
    const cssFilter = gulpFilter(['**/*.css'], { restore: true });
    stream = stream
      .pipe(jsFilter)
      .pipe(
        process.env.WEBCUBE_USE_UGLIFY
          ? uglify()
          : // https://github.com/babel/minify/tree/master/packages/babel-preset-minify#options
            minify({
              mangle: {
                keepClassName: Boolean(process.env.WEBCUBE_MINIFY_KEEP_NAME),
                keepFnName: Boolean(process.env.WEBCUBE_MINIFY_KEEP_NAME),
              },
              removeConsole: { exclude: ['info', 'error', 'warn'] },
              removeDebugger: true,
            })
      )
      .pipe(
        rename({
          suffix: '_min',
        })
      )
      .pipe(gulp.dest(`build/public/${staticRoot}/`, { cwd: projectPath }))
      .pipe(jsFilter.restore)
      .pipe(cssFilter)
      .pipe(
        rename({
          suffix: '_min',
        })
      )
      .pipe(gulp.dest(`build/public/${staticRoot}/`, { cwd: projectPath }))
      .pipe(cssFilter.restore);
  }
  return stream;
}

function buildHTML() {
  const revData = JSON.parse(
    fs.readFileSync(path.join(projectPath, 'rev-version.json'))
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
    filename.split('.').forEach(name => {
      res = (typeof res === 'object' && res[name]) || $2;
    });
    if (!/\.(js|css)$/.test(res)) {
      return $0;
    }
    if (isProductionEnv) {
      res = res.replace(RE_ADD_MIN, '$1_min.$2');
    }
    return `${$1}"${res}"`;
  }
  let stream = gulp
    .src('staticweb/**/*.html', { cwd: projectPath })
    .pipe(replace(RE_JS_FILE, replaceRev))
    .pipe(replace(RE_CSS_FILE, replaceRev))
    .pipe(
      inlinesource({
        rootpath: path.join(projectPath, 'build/public'),
      })
    );
  if (isProductionEnv && !process.env.WEBCUBE_DISABLE_HTMLMIN) {
    stream = stream.pipe(
      htmlmin({
        // https://github.com/kangax/html-minifier
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
      })
    );
  }
  return stream.pipe(gulp.dest('build/public', { cwd: projectPath }));
}

function startStaticWebServer(done) {
  fs.writeFileSync(pidFile, process.pid);
  const config = jsonfile.readFileSync(
    path.join(modulePath, 'configs/superstatic.json')
  );
  let customConfig;
  try {
    customConfig = jsonfile.readFileSync(
      path.join(projectPath, 'configs/static.json')
    );
    delete customConfig.public;
  } catch (e) {
    //
  }
  staticWebServer
    .server({
      port: serverPort,
      host: serverHost,
      cwd: projectPath,
      config: Object.assign({}, config, customConfig),
      errorPage:
        process.env.WEBCUBE_STATIC_SERVER_ERROR_PAGE ||
        path.join(modulePath, 'templates/configs/404.html'),
      debug: Boolean(process.env.WEBCUBE_STATIC_SERVER_ENABLE_DEBUG),
      gzip: Boolean(process.env.WEBCUBE_STATIC_SERVER_ENABLE_GZIP),
    })
    .listen(() => {
      console.info(`Listening at http://${serverHost}:${serverPort}`);
      done();
    });
}

function stopStaticWebServer(done) {
  fs.stat(pidFile, err => {
    if (err) {
      done();
      return;
    }
    let lastPid, isRunning;
    try {
      lastPid = parseInt(fs.readFileSync(pidFile).toString(), 10);
      fs.unlinkSync(pidFile);
      isRunning = lastPid && running(lastPid);
    } catch (ex) {
      console.info(ex.message);
      done();
      return;
    }
    if (isRunning) {
      console.info('Stopping static server...');
      process.kill(lastPid);
    } else {
      console.info('No static server');
    }
    const WAIT_FOR_STOP = 300;
    setTimeout(() => {
      done();
    }, WAIT_FOR_STOP);
  });
}

gulp.task('clean:app', done => {
  del([`build/public/${staticRoot}/**`, 'build/public/static-for-dev/**'], {
    cwd: projectPath,
  }).then(() => done());
});

gulp.task('clean:html', done => {
  del([`build/public/!(${staticRoot}|static-for-dev)/**`], {
    cwd: projectPath,
  }).then(() => done());
});

gulp.task('check:html', [], () =>
  gulp
    .src('staticweb/**/*.html', { cwd: projectPath })
    .pipe(
      gulpif(
        !process.env.WEBCUBE_DISABLE_HTMLHINT,
        htmlhint({
          // https://github.com/yaniswang/HTMLHint/wiki/Rules
          htmlhintrc: htmlhintrcPath,
        })
      )
    )
    .pipe(
      gulpif(!process.env.WEBCUBE_DISABLE_HTMLHINT, htmlhint.failReporter())
    )
);

gulp.task('update:app', ['clean:app'], () => buildApp(webpackConfig));

gulp.task('build:app', ['clean:app'], () => buildApp(webpackConfig));

gulp.task('build:html', ['clean:html', 'check:html'], buildHTML);

gulp.task(
  'build:staticweb',
  ['clean:html', 'check:html', 'build:app'],
  buildHTML
);

gulp.task(
  'deploy:staticweb:html',
  [],
  cloudAdapter.deployHTML([`build/public/!(${staticRoot})/**/*.html`], {
    cwd: projectPath,
  })
);

gulp.task(
  'deploy:staticweb:assets',
  [],
  cloudAdapter.deployStatic([`build/public/${staticRoot}/**/*`], {
    cwd: projectPath,
  })
);

gulp.task('start:staticserver', done => {
  stopStaticWebServer(() => {
    startStaticWebServer(done);
  });
});

gulp.task('stop:staticserver', done => {
  stopStaticWebServer(done);
});

gulp.task('default', ['build:staticweb']);
