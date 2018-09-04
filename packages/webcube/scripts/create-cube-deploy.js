#!/usr/bin/env node
const path = require('path');
const program = require('commander');
const shell = require('shelljs');
const {
  rootPath,
  webcubePath,
  projectPath,
  projectName,
  output,
} = require('../utils/custom');
const { runCmd, getDeployConfig } = require('../utils/helpers');
const logger = require('../utils/logger');

program
  .option('-s --disable-static', "Don't build and upload static files")
  .option('-i --disable-image', "Don't build and push docker image")
  .parse(process.argv);

const cloud = getDeployConfig().staticCloud;
const isMonoRepo = projectPath !== rootPath;
const accessKeyId = process.env.ACCESS_KEY_ID;
const accessKeySecret = process.env.ACCESS_KEY_SECRET;
const registryUrl = process.env.REGISTRY_URL;
const packagesPath = process.env.MONOREPO_PACKAGES_PATH || '';
const enableChinaMirror = process.env.ENABLE_CHINA_MIRROR;

(async () => {
  if (!program.disableStatic && accessKeyId && accessKeySecret) {
    if (cloud === 'oss') {
      await runCmd(
        `${path.join(webcubePath, 'scripts/ossutil')} cp ${output.htmlRoot} ${
          getDeployConfig().staticCloudUrl
        } -r -i ${accessKeyId} -k ${accessKeySecret} -e ${
          getDeployConfig().staticCloudEndpoint
        } -f`
      );
    } else if (cloud === 's3') {
      await runCmd(
        `s3cmd sync ${output.htmlRoot} ${
          getDeployConfig().staticCloudUrl
        } -r --access_key=${accessKeyId} --secret_key=${accessKeySecret} -e ${
          getDeployConfig().staticCloudEndpoint
        } -f`
      );
    } else {
      logger.fail('Unsupported static cloud');
    }
  }

  if (!program.disableImage && registryUrl) {
    if (isMonoRepo) {
      shell.pushd(rootPath);
    }
    await runCmd(
      `docker build -t ${projectName} --build-arg MONOREPO_APP_PATH="${path.relative(
        rootPath,
        projectPath
      )}" --build-arg MONOREPO_PACKAGES_PATH="${packagesPath}" --build-arg ENABLE_CHINA_MIRROR=${enableChinaMirror} .`
    );

    await runCmd(`docker tag ${projectName} ${registryUrl}`);

    await runCmd(`docker push ${registryUrl}`);

    if (isMonoRepo) {
      shell.popd();
    }
  }
})();
