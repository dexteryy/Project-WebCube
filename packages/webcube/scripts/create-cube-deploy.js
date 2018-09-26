#!/usr/bin/env node
const path = require('path');
const program = require('commander');
const shell = require('shelljs');
const {
  rootPath,
  projectPath,
  projectName,
  output,
} = require('../utils/custom');
const { runCmd, getDeployConfig } = require('../utils/helpers');
const logger = require('../utils/logger');

program
  .option('-u --disable-static', "Don't build and upload static files")
  .option('-b --disable-build-image', "Don't build docker image")
  .option('-p --disable-push-image', "Don't push docker image")
  .option('-q --quiet', 'Hide webcube log')
  .parse(process.argv);

const cloud = getDeployConfig().staticCloud;
const isMonoRepo = projectPath !== rootPath;
const accessKeyId = process.env.ACCESS_KEY_ID;
const accessKeySecret = process.env.ACCESS_KEY_SECRET;
const registryUrl = process.env.REGISTRY_URL;
const packagesPath = process.env.MONOREPO_PACKAGES_PATH || '';
const enableChinaMirror = process.env.ENABLE_CHINA_MIRROR;
const { quiet } = program;

(async () => {
  if (!program.disableStatic && accessKeyId && accessKeySecret) {
    if (cloud === 'oss') {
      await runCmd(
        `${process.env.OSSUTIL_PATH} cp ${output.htmlRoot} ${
          getDeployConfig().staticCloudUrl
        } -r -i ${accessKeyId} -k ${accessKeySecret} -e ${
          getDeployConfig().staticCloudEndpoint
        } --output-dir=${
          output.buildRoot
        } -f --meta="Cache-Control:max-age=31536000, public"`,
        { quiet }
      );
    } else if (cloud === 's3') {
      await runCmd(
        `AWS_ACCESS_KEY_ID=${accessKeyId} AWS_SECRET_ACCESS_KEY=${accessKeySecret} ${
          process.env.AWSCLI_PATH
        } s3 cp ${output.htmlRoot} ${
          getDeployConfig().staticCloudUrl
        } --recursive --region=${
          getDeployConfig().staticCloudRegion
        } --cache-control="max-age=31536000, public"`,
        { quiet }
      );
    } else {
      logger.fail('Unsupported static cloud');
    }
  }

  if (isMonoRepo) {
    shell.pushd(rootPath);
  }

  if (!program.disableBuildImage) {
    await runCmd(
      `docker build -t ${projectName} --build-arg MONOREPO_APP_PATH="${path.relative(
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
