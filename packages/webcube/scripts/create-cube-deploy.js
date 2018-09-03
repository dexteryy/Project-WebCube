#!/usr/bin/env node
const path = require('path');
const program = require('commander');
const shell = require('shelljs');
const {
  webcubePath,
  projectPath,
  projectName,
  output,
} = require('../utils/custom');
const { getDeployConfig } = require('../utils/helpers');
const logger = require('../utils/logger');

program
  .option('-s --enable-static', 'Build and upload static files')
  .option('-i --enable-image', 'Build and push docker image')
  .parse(process.argv);

const cloud = getDeployConfig().staticCloud;
const cwd = process.cwd();
const isMonoRepo = projectPath === cwd;
const registryUrl = process.env.REGISTRY_URL;
const packagesPath = process.env.MONOREPO_PACKAGES_PATH || '';
const enableChinaMirror = process.env.ENABLE_CHINA_MIRROR;

function runCmd(cmd) {
  const { code, stdout, stderr } = shell.exec(cmd);
  if (stdout) {
    console.info(stdout);
  }
  if (stderr) {
    console.error(stderr);
  }
  if (code) {
    process.exit(code);
  }
}

if (program.enableStatic) {
  if (cloud === 'oss') {
    runCmd(
      `${path.join(webcubePath, 'scripts/ossutil')} cp ${output.htmlRoot} ${
        getDeployConfig().staticCloudUrl
      } -r -i ${process.env.ACCESS_KEY_ID} -k ${
        process.env.ACCESS_KEY_SECRET
      } -e ${getDeployConfig().staticCloudEndpoint} -f`
    );
  } else if (cloud === 's3') {
    runCmd(
      `s3cmd sync ${output.htmlRoot} ${
        getDeployConfig().staticCloudUrl
      } -r --access_key=${process.env.ACCESS_KEY_ID} --secret_key=${
        process.env.ACCESS_KEY_SECRET
      } -e ${getDeployConfig().staticCloudEndpoint} -f`
    );
  } else {
    logger.fail('Unsupported static cloud');
  }
}

if (program.enableImage) {
  if (isMonoRepo) {
    shell.pushd(path.join(webcubePath, '../../'));
  }

  runCmd(
    `docker build -t ${projectName} --build-arg MONOREPO_APP_PATH="${path.relative(
      cwd,
      projectPath
    )}" --build-arg MONOREPO_PACKAGES_PATH="${packagesPath}" --build-arg ENABLE_CHINA_MIRROR=${enableChinaMirror} .`
  );

  runCmd(`docker tag ${projectName} ${registryUrl}`);

  runCmd(`docker push ${registryUrl}`);

  if (isMonoRepo) {
    shell.popd();
  }
}
