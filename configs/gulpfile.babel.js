
// example:
/*
import gulp from 'gulp';
import {
  rootPath,
  staticRoot,
  cloudAdapter,
} from '../internals/utils';

gulp.task('deploy:custom', [
  'build:html',
], cloudAdapter.deployStatic([
  `build/public/${staticRoot}/**`,
], {
  cwd: rootPath,
  accessKeyId: process.env.APP_DEPLOY_CUSTOM_OSS_ID,
  secretAccessKey: process.env.APP_DEPLOY_CUSTOM_OSS_SECRET,
  bucket: process.env.APP_DEPLOY_CUSTOM_OSS_BUCKET,
  root: process.env.APP_CUSTOM_ROOT,
  CacheControl: `max-age=${process.env.APP_CUSTOM_MAXAGE}, public`,
}));
*/
