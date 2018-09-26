const { spawn } = require('child_process');
const Combinatorics = require('js-combinatorics');
const { entryNameToId } = require('./custom/base');
const { mode, output, deploy } = require('./custom');
const logger = require('./logger');

exports.getDeployConfig = () => deploy[deploy.env];

exports.getOutputConfig = () => output[mode];

exports.getExcludeNames = (names, name) =>
  Object.keys(names).filter(otherName => otherName !== name);

exports.getExcludeSplitChunks = (entries, entry) => {
  const otherEntries = exports.getExcludeNames(entries, entry);
  if (!otherEntries.length) {
    return [];
  }
  const combs = Combinatorics.permutationCombination(otherEntries);
  const otherPossibleVendors = combs.map(
    comb => `vendors${output.chunkDelimiter}${comb.join(output.chunkDelimiter)}`
  );
  const otherPossibleCommons = combs.map(
    comb => `commons${output.chunkDelimiter}${comb.join(output.chunkDelimiter)}`
  );
  return otherPossibleVendors.concat(otherPossibleCommons).concat(otherEntries);
};

exports.getIncludeSplitChunks = (entries, entry) => {
  const otherEntries = exports.getExcludeNames(entries, entry);
  const list = [];
  otherEntries.forEach((otherEntry, i) => {
    list.push(entry, otherEntries.slice(i));
  });
  const results = [];
  list.forEach(set => {
    if (!set.length) {
      return;
    }
    Combinatorics.permutation(set).forEach(comb => {
      results.push(
        `vendors${output.chunkDelimiter}${comb.join(output.chunkDelimiter)}`
      );
      results.push(
        `commons${output.chunkDelimiter}${comb.join(output.chunkDelimiter)}`
      );
    });
  });
  return results;
};

exports.getWebpackStats = opt =>
  Object.assign(
    {
      // https://webpack.js.org/configuration/stats/
      colors: Boolean(logger.supportsColor),
      errors: true,
      errorDetails: false,
      warnings: true,
      // warningsFilter: /node_modules/,
      performance: true,
      timings: true,
      builtAt: true,
      assets: true,
      entrypoints: true,
      chunks: false,
      // https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/35
      children: false, // required
      modules: false, // required
      chunkModules: false, // required
    },
    opt
  );

exports.entryNameToId = entryNameToId;

exports.runCmd = function runCmd(cmd, opt = {}) {
  return new Promise(resolve => {
    if (!opt.quiet) {
      logger.info(cmd);
    }
    const child = spawn(cmd, {
      stdio: 'inherit',
      shell: true,
    });
    child.on('exit', code => {
      if (code) {
        process.exit(code);
      }
      resolve();
    });
  });
};
