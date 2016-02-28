// https://github.com/amwmedia/plop

module.exports = function (plop) {

  const addEntryActions = [{
    type: 'add',
    path: '../src/entries/{{entryName}}/index.js',
    templateFile: '../templates/src/entries/index.js',
  }, {
    type: 'add',
    path: '../src/entries/{{entryName}}/index.scss',
    templateFile: '../templates/src/entries/index.scss',
  }, {
    type: 'add',
    path: '../src/entries/{{entryName}}/AppView.jsx',
    templateFile: '../templates/src/entries/AppView.jsx',
  }, {
    type: 'add',
    path: '../staticweb/{{entryName}}/index.html',
    templateFile: '../templates/staticweb/index.html',
  }, {
    type: 'add',
    path: '../staticweb/{{entryName}}/deploy.js',
    templateFile: '../templates/staticweb/deploy.js',
  }, {
    type: 'add',
    path: '../staticweb/{{entryName}}/deploy.scss',
    templateFile: '../templates/staticweb/deploy.scss',
  }, {
    type: 'add',
    path: '../test/functionals/{{entryName}}/index.spec.js',
    templateFile: '../templates/test/functionals/spec.js',
  }];

  plop.setGenerator('entry', {
    description: 'Add a new entry point',
    prompts: [{
      type: 'input',
      name: 'entryName',
      message: 'What is the name of new entry point? (hyphen-separated lowercase, i.e. "about-page")',
      validate,
    }],
    actions: addEntryActions.concat([{
      type: 'modify',
      path: 'webpack.default.config.babel.js',
      pattern: /^(\s*)(\/\* DO NOT MODIFY THIS! NEW ENTRY WILL BE AUTOMATICALLY APPENDED TO HERE \*\/)/m,
      template: '$1\'{{entryName}}\': [\'./staticweb/{{entryName}}/deploy.js\'],\n$1$2',
    }]),
  });

  plop.setGenerator('demo', {
    description: 'Add a new entry point for demo (run `npm run new initDemo` first)',
    prompts: [{
      type: 'input',
      name: 'entryName',
      message: 'What is the name of new entry point? (hyphen-separated lowercase, begin with "demo-", i.e. "demo-app")',
      validate(value) {
        const res = validate(value);
        if (res !== true) {
          return res;
        }
        if (/^demo\-/.test(value)) {
          return true;
        }
        return 'Wrong, a demo entry\'s name must begin with "demo-", i.e. "demo-app"';
      },
    }],
    actions: addEntryActions.concat([{
      type: 'modify',
      path: 'webpack.demo.config.babel.js',
      pattern: /^(\s*)(\/\* DO NOT MODIFY THIS! NEW DEMO WILL BE AUTOMATICALLY APPENDED TO HERE \*\/)/m,
      template: '$1\'{{entryName}}\': defaultCode.concat([\'./staticweb/{{entryName}}/deploy.js\']),\n$1$2',
    }]),
  });

  plop.setGenerator('initDemo', {
    description: 'Initialize config files for demo entries',
    actions: [{
      type: 'add',
      path: 'webpack.demo.config.babel.js',
      templateFile: '../templates/configs/webpack.demo.config.babel.js',
    }],
  });

  plop.setGenerator('component', {
    description: 'Add a new component',
    prompts: [{
      type: 'input',
      name: 'componentName',
      message: 'What is the name of new component? (hyphen-separated lowercase, i.e. "welcome-box")',
      validate,
    }],
    actions: [{
      type: 'add',
      path: '../src/components/{{pascalCase componentName}}/index.jsx',
      templateFile: '../templates/src/components/index.jsx',
    }, {
      type: 'add',
      path: '../src/components/{{pascalCase componentName}}/index.scss',
      templateFile: '../templates/src/components/index.scss',
    }, {
      type: 'add',
      path: '../test/units/{{pascalCase componentName}}.spec.js',
      templateFile: '../templates/test/units/component.spec.js',
    }],
  });

};

function validate(value) {
  if (/^[a-z][a-z0-9\-]+$/.test(value)) {
    return true;
  }
  return 'wrong format';
}
