const path = require('path');
const through = require('through2');
const gulp = require('gulp');
const gutil = require('gulp-util');
const mime = require('mime-types');
const ALY = require('aliyun-sdk');
const { isStagingEnv } = require('../');

const mimeOverride = {};

function parsePath(strPath) {
  const extname = path.extname(strPath);
  return {
    dirname: path.dirname(strPath),
    basename: path.basename(strPath, extname),
    extname,
  };
}

exports.deploy = function deploy(opt) {
  return through(
    {
      objectMode: true,
    },
    (file, encoding, callback) => {
      if (file.stat.isDirectory()) {
        callback(null, file);
        return;
      }
      const key = path.join(opt.root || '', file.relative);
      const parsedPath = parsePath(key);
      const contentType =
        mimeOverride[parsedPath.extname] || mime.lookup(parsedPath.extname);
      let contentEncoding = opt.ContentEncoding;
      if (!contentEncoding && contentEncoding !== '') {
        contentEncoding = mime.charset(contentType) || '';
      }
      gutil.log('uploading:', key);
      const config = {
        Bucket: opt.bucket,
        Key: key,
        Body: file.contents,
        AccessControlAllowOrigin: '',
        ContentType: contentType,
        CacheControl: opt.CacheControl || 'no-cache',
        ContentEncoding: contentEncoding,
        Expires: null,
      };
      new ALY.OSS({
        accessKeyId: opt.accessKeyId || process.env.WEBCUBE_DEPLOY_OSS_ID,
        secretAccessKey:
          opt.secretAccessKey || process.env.WEBCUBE_DEPLOY_OSS_SECRET,
        endpoint: opt.endpoint || process.env.WEBCUBE_DEPLOY_OSS_ENDPOINT,
        apiVersion: opt.apiVersion || '2013-10-15',
      }).putObject(config, (err, data) => {
        if (err) {
          callback(new Error(`Failed: [${err.code}] ${err.message}`), file);
          return;
        }
        gutil.log('success:', key, data);
        callback(null, file);
      });
    }
  );
};

exports.deployHTML = function deployHTML(src, opt) {
  const seconds = 60;
  return function() {
    return gulp.src(src, { cwd: opt.cwd }).pipe(
      exports.deploy(
        Object.assign(
          {},
          {
            bucket: isStagingEnv
              ? process.env.WEBCUBE_DEPLOY_STAGING_OSS_BUCKET
              : process.env.WEBCUBE_DEPLOY_OSS_BUCKET,
            CacheControl: `max-age=${seconds}, public`,
            ContentEncoding: '', // enable CDN GZip
          },
          opt
        )
      )
    );
  };
};

exports.deployStatic = function deployStatic(src, opt) {
  return function() {
    const yearToSeconds = 60 * 60 * 24 * 365;
    const d = new Date();
    d.setTime(d.getTime() + 1000 * yearToSeconds);
    return gulp.src(src, { cwd: opt.cwd }).pipe(
      exports.deploy(
        Object.assign(
          {},
          {
            bucket: isStagingEnv
              ? process.env.WEBCUBE_DEPLOY_STAGING_OSS_BUCKET
              : process.env.WEBCUBE_DEPLOY_OSS_BUCKET,
            root: process.env.WEBCUBE_STATIC_ROOT,
            CacheControl: `max-age=${yearToSeconds}, public`,
            ContentEncoding: '', // enable CDN GZip
          },
          opt
        )
      )
    );
  };
};
