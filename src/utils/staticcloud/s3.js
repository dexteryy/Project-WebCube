
import path from 'path';
import through from 'through2';
import gulp from 'gulp';
import gutil from 'gulp-util';
import mime from 'mime-types';
import AWS from 'aws-sdk';

const mimeOverride = {
};

function parsePath(strPath) {
  const extname = path.extname(strPath);
  return {
    dirname: path.dirname(strPath),
    basename: path.basename(strPath, extname),
    extname,
  };
}

export function deploy(opt) {
  return through({
    objectMode: true,
  }, function (file, encoding, callback) {
    if (file.stat.isDirectory()) {
      callback(null, file);
      return;
    }
    const key = path.join(opt.root || '', file.relative);
    const parsedPath = parsePath(key);
    const contentType = mimeOverride[parsedPath.extname]
      || mime.lookup(parsedPath.extname);
    let contentEncoding = opt.ContentEncoding;
    if (!contentEncoding && contentEncoding !== '') {
      contentEncoding = mime.charset(contentType) || '';
    }
    gutil.log('uploading:', key);
    new AWS.S3({
      accessKeyId: opt.accessKeyId
        || process.env.APP_DEPLOY_S3_ID,
      secretAccessKey: opt.secretAccessKey
        || process.env.APP_DEPLOY_S3_SECRET,
      endpoint: opt.endpoint
        || process.env.APP_DEPLOY_S3_ENDPOINT,
      apiVersion: opt.apiVersion
        || '2006-03-01',
    }).putObject({
      ACL: 'public-read',
      Bucket: opt.bucket,
      Key: key,
      Body: file.contents,
      ContentType: contentType,
      CacheControl: opt.CacheControl || 'no-cache',
      ContentEncoding: contentEncoding,
    }, function (err, data) {
      if (err) {
        gutil.log('error:', err.code, err.message);
        return;
      }
      gutil.log('success:', key, data);
      callback(null, file);
    });
  });
}

export function deployHTML(src, opt) {
  const seconds = 60;
  return function () {
    return gulp.src(src, { cwd: opt.cwd })
      .pipe(deploy(Object.assign({}, {
        bucket: process.env.APP_DEPLOY_S3_BUCKET,
        CacheControl: `mmax-age=${seconds}, public`,
        ContentEncoding: '', // enable CDN GZip
      }, opt)));
  };
}

export function deployStatic(src, opt) {
  return function () {
    const yearToSeconds = 60 * 60 * 24 * 365;
    const d = new Date();
    d.setTime(d.getTime() + 1000 * yearToSeconds);
    return gulp.src(src, { cwd: opt.cwd })
      .pipe(deploy(Object.assign({}, {
        bucket: process.env.APP_DEPLOY_S3_BUCKET,
        root: process.env.APP_STATIC_ROOT,
        CacheControl: `max-age=${yearToSeconds}, public`,
        ContentEncoding: '', // enable CDN GZip
      }, opt)));
  };
}
