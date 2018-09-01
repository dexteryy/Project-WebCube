#!/usr/bin/env node
const path = require('path');
const program = require('commander');
const shell = require('shelljs');
const { webcubePath, output } = require('../utils/custom');
const { getDeployConfig } = require('../utils/helpers');
const logger = require('../utils/logger');

program.parse(process.argv);

if (getDeployConfig().staticCloud === 'oss') {
  shell.exec(
    `${path.join(webcubePath, 'scripts/ossutil')} cp ${output.htmlRoot} ${
      getDeployConfig().staticCloudUrl
    } -r -i ${process.env.ACCESS_KEY_ID} -k ${
      process.env.ACCESS_KEY_SECRET
    } -e ${getDeployConfig().staticCloudEndpoint} -f`,
    (code, stdout, stderr) => {
      if (stdout) {
        console.info(stdout);
      }
      if (stderr) {
        console.error(stderr);
      }
      process.exit(code);
    }
  );
} else if (getDeployConfig().staticCloud === 's3') {
  shell.exec(
    `s3cmd sync ${output.htmlRoot} ${
      getDeployConfig().staticCloudUrl
    } -r --access_key=${process.env.ACCESS_KEY_ID} --secret_key=${
      process.env.ACCESS_KEY_SECRET
    } -e ${getDeployConfig().staticCloudEndpoint} -f`,
    (code, stdout, stderr) => {
      if (stdout) {
        console.info(stdout);
      }
      if (stderr) {
        console.error(stderr);
      }
      process.exit(code);
    }
  );
} else {
  logger.fail('Unsupported static cloud');
}
