const { config } = require('./base');
const output = require('./output');
const deploy = require('./deploy');
const dev = require('./dev');
const webpack = require('./webpack');
const js = require('./js');
const css = require('./css');
const assets = require('./assets');

module.exports = Object.assign(config, {
  output,
  deploy,
  dev,
  webpack,
  js,
  css,
  assets,
});
