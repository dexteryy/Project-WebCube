const fs = require('fs');
const path = require('path');
const stripComments = require('strip-json-comments');

const configPath = path.join(
  __dirname,
  process.env.WEBCUBE_DISABLE_PRETTIER
    ? '.eslintrc.config.json'
    : '.eslintrc.prettier.json'
);
const config = stripComments(fs.readFileSync(configPath, 'utf-8'));

module.exports = JSON.parse(config);
