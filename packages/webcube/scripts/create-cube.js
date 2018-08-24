#!/usr/bin/env node
const path = require('path');
const program = require('commander');

const pkg = require(path.join(__dirname, '../package.json'));

program
  .version(pkg.version)
  .usage('[subcommand] [args]')
  .command('update', 'setup or update all dependencies')
  .command('new [type]', 'Generate code for your app', { isDefault: true })
  .command('lint', 'Lint all code')
  .command('test', 'Test all code')
  .command('dev', 'Run a dev server for your app')
  .command('build', 'Build your app')
  .command('serve', 'Run a static or SSR server for your app')
  .command('deploy', 'Deploy your app')
  .command('check', 'Built-in checklist')
  .command('precommit', 'Run tasks before git commit')
  .parse(process.argv);
