
import path from 'path';
import through from 'through2';
import gulp from 'gulp';
import gutil from 'gulp-util';
import mime from 'mime-types';
import ALY from 'aliyun-sdk';

const mimeOverride = {
};

const oss = new ALY.OSS({
  accessKeyId: process.env.APP_DEPLOY_OSS_ID,
  secretAccessKey: process.env.APP_DEPLOY_OSS_SECRET,
  endpoint: process.env.APP_DEPLOY_OSS_ENDPOINT,
  apiVersion: '2013-10-15',
});

function parsePath(strPath) {
  const extname = path.extname(strPath);
  return {
    dirname: path.dirname(strPath),
    basename: path.basename(strPath, extname),
    extname,
  };
}

function deploy(opt) {
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
    oss.putObject({
      Bucket: opt.bucket,
      Key: key,
      Body: file.contents,
      AccessControlAllowOrigin: '',
      ContentType: contentType,
      CacheControl: opt.CacheControl || 'no-cache',
      // ContentDisposition: 'attachment; '
      //   + `filename="${parsedPath.basename}${parsedPath.extname}"`,
      ContentEncoding: contentEncoding,
      Expires: null,
      // ServerSideEncryption: 'AES256',
      // 'x-oss-object-acl': 'public-read',
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
    return gulp.src(src, opt)
      .pipe(deploy({
        bucket: process.env.APP_DEPLOY_OSS_BUCKET,
        CacheControl: `max-age=${seconds}, public`,
        ContentEncoding: '',
      }));
  };
}

export function deployStatic(src, opt) {
  return function () {
    const yearToSeconds = 60 * 60 * 24 * 365;
    const d = new Date();
    d.setTime(d.getTime() + 1000 * yearToSeconds);
    return gulp.src(src, opt)
      .pipe(deploy({
        bucket: process.env.APP_DEPLOY_OSS_BUCKET,
        root: 'static',
        CacheControl: `max-age=${yearToSeconds}, public`,
        ContentEncoding: '', // enable CDN GZip
      }));
  };
}
