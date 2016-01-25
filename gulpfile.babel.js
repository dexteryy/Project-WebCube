const path = require('path');
const del = require('del');
const gulp = require('gulp');
const rename = require('gulp-rename');
const webpack = require('webpack-stream');
const eslint = require('gulp-eslint');
const jscs = require('gulp-jscs');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const minifycss = require('gulp-minify-css');
const webserver = require('gulp-webserver');

gulp.task('clean:js', (done) => {
  del(['public/static/js/**']).then(() => done());
});

gulp.task('clean:css', (done) => {
  del(['public/static/css/**']).then(() => done());
});

gulp.task('clean:html', (done) => {
  del(['public/**/*.html']).then(() => done());
});

gulp.task('build:js', ['clean:js'], () => {
  return gulp.src('js/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format('stylish'))
    .pipe(eslint.failAfterError())
    .pipe(jscs())
    .pipe(jscs.reporter('console'))
    .pipe(jscs.reporter('failImmediately'));
});

gulp.task('build:js', ['clean:js'], () => {
  return gulp.src('js/**/*.js')
    .pipe(webpack({
      entry: {
        'flip-api-perf': 'flip-api-perf/entry.js',
        temp: 'temp/entry.js',
      },
      output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '../static/js/',
      },
      resolve: {
        root: [
          path.join(__dirname, 'js'),
        ],
        modulesDirectories: ['node_modules'],
      },
      module: {
        loaders: [{
          test: /\.js$/,
          loader: 'babel',
          query: {
            cacheDirectory: true,
            presets: ['react', 'es2015', 'stage-2'],
          },
        }],
      },
    }))
    .pipe(gulp.dest('public/static/js'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '_min',
    }))
    .pipe(gulp.dest('public/static/js'));
});

gulp.task('build:css', ['clean:css'], () => {
  gulp.src('css/**/*.scss', { base: 'css' })
    .pipe(sass({
      // imagePath: image_path,
      includePaths: ['css', 'node_modules/normalize.css'],
    }))
    .pipe(autoprefixer({
      browsers: [
        '> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'Explorer > 7',
      ],
      cascade: false,
    }))
    .pipe(rename((path) => {
      path.basename = path.dirname;
      path.dirname = '';
    }))
    .pipe(gulp.dest('public/static/css'))
    .pipe(minifycss({ keepBreaks: true }))
    .pipe(rename({
      suffix: '_min',
    }))
    .pipe(gulp.dest('public/static/css'));
});

gulp.task('build:html', ['clean:html'], () => {
  gulp.src('docs/**/*.html')
    .pipe(gulp.dest('public'));
});

gulp.task('default', [
  'build:css',
  'build:js',
  'build:html',
]);

gulp.task('watch', () => {
  gulp.watch(['css/**'], ['build:css']);
  gulp.watch(['js/**'], ['build:js']);
  gulp.watch(['docs/**'], ['build:html']);
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
