// example:
// const gulp = require('gulp');
// const { projectPath, staticRoot, cloudAdapter } = require('webcube/utils');

// gulp.task(
//   'deploy:custom',
//   ['build:html'],
//   cloudAdapter.deployStatic([`build/public/${staticRoot}/**`], {
//     cwd: projectPath,
//     accessKeyId: process.env.WEBCUBE_DEPLOY_CUSTOM_OSS_ID,
//     secretAccessKey: process.env.WEBCUBE_DEPLOY_CUSTOM_OSS_SECRET,
//     bucket: process.env.WEBCUBE_DEPLOY_CUSTOM_OSS_BUCKET,
//     root: process.env.WEBCUBE_CUSTOM_ROOT,
//     CacheControl: `max-age=${process.env.WEBCUBE_CUSTOM_MAXAGE}, public`,
//   })
// );
