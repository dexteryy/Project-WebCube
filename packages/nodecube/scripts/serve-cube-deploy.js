#!/usr/bin/env node
const path = require('path');
const program = require('commander');
const shell = require('shelljs');
const { rootPath, projectPath, projectName } = require('../utils/custom');
const { runCmd } = require('../utils/helpers');

program
  .option('-b --disable-build-image', "Don't build docker image")
  .option('-p --disable-push-image', "Don't push docker image")
  .option('-q --quiet', 'Hide nodecube log')
  .parse(process.argv);

const isMonoRepo = projectPath !== rootPath;
const registryUrl = process.env.REGISTRY_URL;
const packagesPath = process.env.MONOREPO_PACKAGES_PATH || '';
const enableChinaMirror = process.env.ENABLE_CHINA_MIRROR;
const { quiet } = program;

(async () => {
  if (isMonoRepo) {
    shell.pushd(rootPath);
  }

  if (!program.disableBuildImage) {
    await runCmd(
      `docker build -t ${projectName} --build-arg NODE_ENV="${
        process.env.NODE_ENV
      }" --build-arg MONOREPO_APP_PATH="${path.relative(
        rootPath,
        projectPath
      )}" --build-arg MONOREPO_PACKAGES_PATH="${packagesPath}" --build-arg ENABLE_CHINA_MIRROR=${enableChinaMirror} .`,
      { quiet }
    );
  }

  if (!program.disablePushImage && registryUrl) {
    await runCmd(`docker tag ${projectName} ${registryUrl}`, { quiet });
    await runCmd(`docker push ${registryUrl}`, { quiet });
  }

  if (isMonoRepo) {
    shell.popd();
  }
})();
