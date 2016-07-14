// https://github.com/amwmedia/plop

import path from 'path';
import {
  rootPath,
} from '../utils';

let customPlopfile;
try {
  customPlopfile = require(path.join(rootPath,
    `${process.env.APP_CUSTOM_CONFIG_ROOT}/plopfile.babel.js`));
} catch (ex) {
  console.log('No custom plopfile');
}

module.exports = function (plop) {

  if (customPlopfile) {
    customPlopfile(plop);
  }

  const addReactEntryActions = [{
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/index.js'),
    templateFile: '../templates/app/entries/react/index.js',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/containers/App.jsx'),
    templateFile: '../templates/app/entries/react/containers/App.jsx',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/containers/App.scss'),
    templateFile: '../templates/app/entries/react/containers/App.scss',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/styles/_variables.scss'),
    templateFile: '../templates/app/entries/react/styles/_variables.scss',
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
    path: path.join(rootPath, 'app/entries/{{entryName}}/tests/index.spec.js'),
    templateFile: '../templates/test/functionals/entry.spec.js',
  }];

  const addReactRouterEntryActions = [{
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/index.js'),
    templateFile: '../templates/app/entries/react-router/index.js',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/containers/App.jsx'),
    templateFile: '../templates/app/entries/react-router/containers/App.jsx',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/containers/App.scss'),
    templateFile: '../templates/app/entries/react-router/containers/App.scss',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/routes/index.jsx'),
    templateFile: '../templates/app/entries/react-router/routes/index.jsx',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/styles/_variables.scss'),
    templateFile: '../templates/app/entries/react-router/styles/_variables.scss',
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
    path: path.join(rootPath, 'app/entries/{{entryName}}/tests/index.spec.js'),
    templateFile: '../templates/test/functionals/entry.spec.js',
  }];

  const addReactReduxEntryActions = [{
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/index.js'),
    templateFile: '../templates/app/entries/react-redux/index.js',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/reducers/index.js'),
    templateFile: '../templates/app/entries/react-redux/reducers/index.js',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/actions/index.js'),
    templateFile: '../templates/app/entries/react-redux/actions/index.js',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/containers/App.jsx'),
    templateFile: '../templates/app/entries/react-redux/containers/App.jsx',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/containers/App.scss'),
    templateFile: '../templates/app/entries/react-redux/containers/App.scss',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/containers/Home.jsx'),
    templateFile: '../templates/app/entries/react-redux/containers/Home.jsx',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/containers/Home.scss'),
    templateFile: '../templates/app/entries/react-redux/containers/Home.scss',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/styles/_variables.scss'),
    templateFile: '../templates/app/entries/react-redux/styles/_variables.scss',
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
    path: path.join(rootPath, 'app/entries/{{entryName}}/tests/index.spec.js'),
    templateFile: '../templates/test/functionals/entry.spec.js',
  }];

  const addReactReduxRouterEntryActions = [{
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/index.js'),
    templateFile: '../templates/app/entries/react-redux-router/index.js',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/routes/index.jsx'),
    templateFile: '../templates/app/entries/react-redux-router/routes/index.jsx',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/reducers/index.js'),
    templateFile: '../templates/app/entries/react-redux-router/reducers/index.js',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/actions/index.js'),
    templateFile: '../templates/app/entries/react-redux-router/actions/index.js',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/containers/App.jsx'),
    templateFile: '../templates/app/entries/react-redux-router/containers/App.jsx',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/containers/App.scss'),
    templateFile: '../templates/app/entries/react-redux-router/containers/App.scss',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/containers/Home.jsx'),
    templateFile: '../templates/app/entries/react-redux-router/containers/Home.jsx',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/containers/Home.scss'),
    templateFile: '../templates/app/entries/react-redux-router/containers/Home.scss',
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/entries/{{entryName}}/styles/_variables.scss'),
    templateFile: '../templates/app/entries/react-redux-router/styles/_variables.scss',
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
    path: path.join(rootPath, 'app/entries/{{entryName}}/tests/index.spec.js'),
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
          path: path.join(rootPath, 'env.config'),
          pattern: /([\s\S]*)/,
          template: `$1\n\nAPP_ENTRY_{{constantCase entryName}}=\"./staticweb/{{entryName}}/deploy.js\"`,
        }]);
      },
    };
  };

  plop.setGenerator('entry:react', getEntryOpt({
    description: 'Add a new entry point (with React)',
    actions: addReactEntryActions,
  }));

  plop.setGenerator('entry:react-router', getEntryOpt({
    description: 'Add a new entry point (with React + Router)',
    actions: addReactRouterEntryActions,
  }));

  plop.setGenerator('entry:react-redux', getEntryOpt({
    description: 'Add a new entry point (with React + Redux)',
    actions: addReactReduxEntryActions,
  }));

  plop.setGenerator('entry:react-redux-router', getEntryOpt({
    description: 'Add a new entry point (with React + Redux + Router)',
    actions: addReactReduxRouterEntryActions,
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
          path: path.join(rootPath, 'env.config'),
          pattern: /([\s\S]*)/,
          template: `$1\n\nAPP_{{constantCase entryName}}=\"./staticweb/{{entryName}}/deploy.js\"`,
        }]);
      },
    };
  };

  plop.setGenerator('demo:react', getDemoOpt({
    description: 'Add a new entry point for demo (with React)',
    actions: addReactEntryActions,
  }));

  plop.setGenerator('demo:react-router', getDemoOpt({
    description: 'Add a new entry point for demo (with React + Router)',
    actions: addReactRouterEntryActions,
  }));

  plop.setGenerator('demo:react-redux', getDemoOpt({
    description: 'Add a new entry point for demo (with React + Redux)',
    actions: addReactReduxEntryActions,
  }));

  plop.setGenerator('demo:react-redux-router', getDemoOpt({
    description: 'Add a new entry point for demo (with React + Redux + Router)',
    actions: addReactReduxRouterEntryActions,
  }));

};

function validate(value) {
  if (/^[a-z][a-z0-9\-]+$/.test(value)) {
    return true;
  }
  return 'wrong format';
}
