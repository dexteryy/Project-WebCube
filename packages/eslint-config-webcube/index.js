const fs = require('fs');
const path = require('path');
const stripComments = require('strip-json-comments');

const configPath = path.join(__dirname, '.eslintrc.prettier.json');
const config = stripComments(fs.readFileSync(configPath, 'utf-8'));

module.exports = JSON.parse(config);
