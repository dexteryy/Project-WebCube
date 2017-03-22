// https://github.com/amwmedia/plop

import path from 'path';
import {
  rootPath,
  modulePath,
} from '../utils';

let customPlopfile;
try {
  customPlopfile = require(path.join(rootPath,
    `${process.env.WEBCUBE_CUSTOM_CONFIG_ROOT}/plopfile.babel.js`));
} catch (ex) {
  console.log('No custom plopfile');
}

module.exports = function (plop) {

  if (customPlopfile) {
    customPlopfile(plop);
  }

  const addReactEntryActions = [{
    type: 'add',
    path: path.join(rootPath, 'app/{{entryName}}/index.js'),
    templateFile: path.join(modulePath, 'templates/app/entries/react/index.js'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/{{entryName}}/main/containers/App.jsx'),
    templateFile: path.join(modulePath, 'templates/app/entries/react/main/containers/App.jsx'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'staticweb/{{entryName}}/index.html'),
    templateFile: path.join(modulePath, 'templates/staticweb/index.html'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'staticweb/{{entryName}}/deploy.js'),
    templateFile: path.join(modulePath, 'templates/staticweb/deploy.js'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'staticweb/{{entryName}}/deploy.scss'),
    templateFile: path.join(modulePath, 'templates/staticweb/deploy.scss'),
  }];

  const addReactRouterEntryActions = [{
    type: 'add',
    path: path.join(rootPath, 'app/{{entryName}}/index.js'),
    templateFile: path.join(modulePath, 'templates/app/entries/react-router/index.js'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/{{entryName}}/routes.jsx'),
    templateFile: path.join(modulePath, 'templates/app/entries/react-router/routes.jsx'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/{{entryName}}/main/containers/App.jsx'),
    templateFile: path.join(modulePath, 'templates/app/entries/react-router/main/containers/App.jsx'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'staticweb/{{entryName}}/index.html'),
    templateFile: path.join(modulePath, 'templates/staticweb/index.html'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'staticweb/{{entryName}}/deploy.js'),
    templateFile: path.join(modulePath, 'templates/staticweb/deploy.js'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'staticweb/{{entryName}}/deploy.scss'),
    templateFile: path.join(modulePath, 'templates/staticweb/deploy.scss'),
  }];

  const addReactReduxEntryActions = [{
    type: 'add',
    path: path.join(rootPath, 'app/{{entryName}}/index.js'),
    templateFile: path.join(modulePath, 'templates/app/entries/react-redux/index.js'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/{{entryName}}/main/reducers/index.js'),
    templateFile: path.join(modulePath, 'templates/app/entries/react-redux/main/reducers/index.js'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/{{entryName}}/main/actions/index.js'),
    templateFile: path.join(modulePath, 'templates/app/entries/react-redux/main/actions/index.js'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/{{entryName}}/main/containers/App.jsx'),
    templateFile: path.join(modulePath, 'templates/app/entries/react-redux/main/containers/App.jsx'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/{{entryName}}/main/containers/Home.jsx'),
    templateFile: path.join(modulePath, 'templates/app/entries/react-redux/main/containers/Home.jsx'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'staticweb/{{entryName}}/index.html'),
    templateFile: path.join(modulePath, 'templates/staticweb/index.html'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'staticweb/{{entryName}}/deploy.js'),
    templateFile: path.join(modulePath, 'templates/staticweb/deploy.js'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'staticweb/{{entryName}}/deploy.scss'),
    templateFile: path.join(modulePath, 'templates/staticweb/deploy.scss'),
  }];

  const addReactReduxRouterEntryActions = [{
    type: 'add',
    path: path.join(rootPath, 'app/{{entryName}}/index.js'),
    templateFile: path.join(modulePath, 'templates/app/entries/react-redux-router/index.js'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/{{entryName}}/routes.jsx'),
    templateFile: path.join(modulePath, 'templates/app/entries/react-redux-router/routes.jsx'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/{{entryName}}/main/reducers/index.js'),
    templateFile: path.join(modulePath, 'templates/app/entries/react-redux-router/main/reducers/index.js'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/{{entryName}}/main/actions/index.js'),
    templateFile: path.join(modulePath, 'templates/app/entries/react-redux-router/main/actions/index.js'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/{{entryName}}/main/containers/App.jsx'),
    templateFile: path.join(modulePath, 'templates/app/entries/react-redux-router/main/containers/App.jsx'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'app/{{entryName}}/main/containers/Home.jsx'),
    templateFile: path.join(modulePath, 'templates/app/entries/react-redux-router/main/containers/Home.jsx'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'staticweb/{{entryName}}/index.html'),
    templateFile: path.join(modulePath, 'templates/staticweb/index.html'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'staticweb/{{entryName}}/deploy.js'),
    templateFile: path.join(modulePath, 'templates/staticweb/deploy.js'),
  }, {
    type: 'add',
    path: path.join(rootPath, 'staticweb/{{entryName}}/deploy.scss'),
    templateFile: path.join(modulePath, 'templates/staticweb/deploy.scss'),
  }];

  const getEntryOpt = opt => {
    const updateEnvConfig = {
      type: 'modify',
      pattern: /([\s\S]*)/,
      template: '$1\n\nWEBCUBE_ENTRY_{{constantCase entryName}}=\"./staticweb/{{entryName}}/deploy.js\"',
    };
    return {
      description: opt.description,
      prompts: [{
        type: 'input',
        name: 'entryName',
        message: 'What is the name of new entry point? (hyphen-separated lowercase, i.e. "about-page")',
        validate,
      }],
      actions: () => {
        return opt.actions.concat([
          Object.assign({
            path: path.join(rootPath, 'env.config'),
          }, updateEnvConfig),
          Object.assign({
            path: path.join(rootPath, 'configs/env.sample.config'),
          }, updateEnvConfig),
        ]);
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
    const updateEnvConfig = {
      type: 'modify',
      pattern: /([\s\S]*)/,
      template: '$1\n\nWEBCUBE_{{constantCase entryName}}=\"./staticweb/{{entryName}}/deploy.js\"',
    };
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
        return opt.actions.concat([
          Object.assign({
            path: path.join(rootPath, 'env.config'),
          }, updateEnvConfig),
          Object.assign({
            path: path.join(rootPath, 'configs/env.sample.config'),
          }, updateEnvConfig),
        ]);
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
