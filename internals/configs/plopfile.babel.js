// https://github.com/amwmedia/plop

const path = require('path');
const rootPath = path.join(__dirname, '../..');

module.exports = function (plop) {

  const addReactEntryActions = [{
    type: 'add',
    path: path.join(rootPath, 'src/entries/{{entryName}}/index.js'),
    templateFile: '../templates/src/entries/react/index.js',
  }, {
    type: 'add',
    path: path.join(rootPath, 'src/entries/{{entryName}}/containers/App.jsx'),
    templateFile: '../templates/src/entries/react/containers/App.jsx',
  }, {
    type: 'add',
    path: path.join(rootPath, 'src/entries/{{entryName}}/containers/App.scss'),
    templateFile: '../templates/src/entries/react/containers/App.scss',
  }, {
    type: 'add',
    path: path.join(rootPath, 'src/entries/{{entryName}}/styles/_variables.scss'),
    templateFile: '../templates/src/entries/react/styles/_variables.scss',
  }, {
    type: 'add',
    path: path.join(rootPath, 'staticweb/{{entryName}}/index.html'),
    templateFile: '../templates/staticweb/index.html',
  }, {
    type: 'add',
    path: path.join(rootPath, 'staticweb/{{entryName}}/deploy.js'),
    templateFile: '../templates/staticweb/deploy.js',
  }, {
    type: 'add',
    path: path.join(rootPath, 'staticweb/{{entryName}}/deploy.scss'),
    templateFile: '../templates/staticweb/deploy.scss',
  }, {
    type: 'add',
    path: path.join(rootPath, 'src/entries/{{entryName}}/tests/index.spec.js'),
    templateFile: '../templates/test/functionals/entry.spec.js',
  }];

  const addReduxEntryActions = [{
    type: 'add',
    path: path.join(rootPath, 'src/entries/{{entryName}}/index.js'),
    templateFile: '../templates/src/entries/react-redux/index.js',
  }, {
    type: 'add',
    path: path.join(rootPath, 'src/entries/{{entryName}}/routes/index.jsx'),
    templateFile: '../templates/src/entries/react-redux/routes/index.jsx',
  }, {
    type: 'add',
    path: path.join(rootPath, 'src/entries/{{entryName}}/reducers/index.js'),
    templateFile: '../templates/src/entries/react-redux/reducers/index.js',
  }, {
    type: 'add',
    path: path.join(rootPath, 'src/entries/{{entryName}}/actions/index.js'),
    templateFile: '../templates/src/entries/react-redux/actions/index.js',
  }, {
    type: 'add',
    path: path.join(rootPath, 'src/entries/{{entryName}}/containers/App.jsx'),
    templateFile: '../templates/src/entries/react-redux/containers/App.jsx',
  }, {
    type: 'add',
    path: path.join(rootPath, 'src/entries/{{entryName}}/containers/App.scss'),
    templateFile: '../templates/src/entries/react-redux/containers/App.scss',
  }, {
    type: 'add',
    path: path.join(rootPath, 'src/entries/{{entryName}}/containers/Home.jsx'),
    templateFile: '../templates/src/entries/react-redux/containers/Home.jsx',
  }, {
    type: 'add',
    path: path.join(rootPath, 'src/entries/{{entryName}}/containers/Home.scss'),
    templateFile: '../templates/src/entries/react-redux/containers/Home.scss',
  }, {
    type: 'add',
    path: path.join(rootPath, 'src/entries/{{entryName}}/styles/_variables.scss'),
    templateFile: '../templates/src/entries/react-redux/styles/_variables.scss',
  }, {
    type: 'add',
    path: path.join(rootPath, 'staticweb/{{entryName}}/index.html'),
    templateFile: '../templates/staticweb/index.html',
  }, {
    type: 'add',
    path: path.join(rootPath, 'staticweb/{{entryName}}/deploy.js'),
    templateFile: '../templates/staticweb/deploy.js',
  }, {
    type: 'add',
    path: path.join(rootPath, 'staticweb/{{entryName}}/deploy.scss'),
    templateFile: '../templates/staticweb/deploy.scss',
  }, {
    type: 'add',
    path: path.join(rootPath, 'src/entries/{{entryName}}/tests/index.spec.js'),
    templateFile: '../templates/test/functionals/entry.spec.js',
  }];

  const getEntryOpt = opt => {
    return {
      description: opt.description,
      prompts: [{
        type: 'input',
        name: 'entryName',
        message: 'What is the name of new entry point? (hyphen-separated lowercase, i.e. "about-page")',
        validate,
      }],
      actions: () => {
        return opt.actions.concat([{
          type: 'modify',
          path: 'env.config',
          pattern: /([.\n\r]*)/,
          template: `$1\n\nAPP_ENTRY_{{constantCase entryName}}=\"./staticweb/{{entryName}}/deploy.js\"`,
        }]);
      },
    };
  };

  plop.setGenerator('entry:react', getEntryOpt({
    description: 'Add a new entry point (with React)',
    actions: addReactEntryActions,
  }));

  plop.setGenerator('entry:redux', getEntryOpt({
    description: 'Add a new entry point (with React + Redux)',
    actions: addReduxEntryActions,
  }));

  const getDemoOpt = opt => {
    return {
      description: opt.description,
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
      actions: () => {
        return opt.actions.concat([{
          type: 'modify',
          path: 'env.config',
          pattern: /([.\n\r]*)/,
          template: `$1\n\nAPP_{{constantCase entryName}}=\"./staticweb/{{entryName}}/deploy.js\"`,
        }]);
      },
    };
  };

  plop.setGenerator('demo:react', getDemoOpt({
    description: 'Add a new entry point for demo (with React)',
    actions: addReactEntryActions,
  }));

  plop.setGenerator('demo:redux', getDemoOpt({
    description: 'Add a new entry point for demo (with React + Redux)',
    actions: addReduxEntryActions,
  }));

};

function validate(value) {
  if (/^[a-z][a-z0-9\-]+$/.test(value)) {
    return true;
  }
  return 'wrong format';
}
