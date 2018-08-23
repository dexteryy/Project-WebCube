#!/usr/bin/env node
const path = require('path');
const program = require('commander');

const pkg = require(path.join(__dirname, '../package.json'));

program
  .version(pkg.version)
  .usage('[subcommand] [args]')
  .command('new [type]', 'Generate code for your app', { isDefault: true })
  .command('lint', 'Lint your app')
  .command('test', 'Test your app')
  .command('dev', 'Run a dev server for your app')
  .command('build', 'Build your app')
  .command('serve', 'Run a static or SSR server for your app')
  .command('deploy', 'Deploy your app')
  .parse(process.argv);
