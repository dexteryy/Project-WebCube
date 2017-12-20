const fs = require('fs');
const path = require('path');
const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer(
  JSON.parse(fs.readFileSync(path.join(__dirname, '.babelrc')))
);
