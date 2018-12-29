#!/usr/bin/env node
const path = require('path');
const program = require('commander');
const updateNotifier = require('update-notifier');
const Insight = require('insight');

const pkg = require(path.join(__dirname, '../package.json'));

const insight = new Insight({
  trackingCode: 'UA-404086-15',
  pkg,
});
if (insight.optOut === undefined) {
  insight.askPermission();
}

updateNotifier({ pkg }).notify({
  isGlobal: false,
  shouldNotifyInNpmScript: true,
});

program
  .version(pkg.version)
  .usage('[subcommand] [args]')
  .command('build', 'Build your app')
  .command('deploy', 'Deploy your app')
  .parse(process.argv);
