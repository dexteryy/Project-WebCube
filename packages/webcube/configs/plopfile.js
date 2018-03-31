// https://github.com/amwmedia/plop

const path = require('path');
const { srcRoot, configRoot, projectPath, modulePath } = require('../utils');

let customPlopfile;
try {
  customPlopfile = require(path.join(projectPath, `${configRoot}/plopfile.js`));
} catch (ex) {
  console.info('No custom plopfile');
}

const addReactEntryFiles = {
  [`${srcRoot}/{{entryName}}/index.jsx`]: 'templates/app/entries/react-app/index.jsx',
  [`${srcRoot}/{{entryName}}/main/index.jsx`]: 'templates/app/entries/react-app/main/index.jsx',
  [`${srcRoot}/{{entryName}}/sample/index.jsx`]: 'templates/app/entries/react-app/sample/index.jsx',
  [`${srcRoot}/{{entryName}}/sample/components/SampleList.jsx`]: 'templates/app/entries/react-app/sample/components/SampleList.jsx',
  [`${srcRoot}/{{entryName}}/sample/constants/sample.js`]: 'templates/app/entries/react-app/sample/constants/sample.js',
  [`${srcRoot}/{{entryName}}/sample/containers/Sample.jsx`]: 'templates/app/entries/react-app/sample/containers/Sample.jsx',
  'staticweb/{{entryName}}/index.html': 'templates/staticweb/index.html',
  'staticweb/{{entryName}}/deploy.js': 'templates/staticweb/deploy.js',
};

const addReactRouterEntryFiles = {
  [`${srcRoot}/{{entryName}}/index.jsx`]: 'templates/app/entries/react-router-app/index.jsx',
  [`${srcRoot}/{{entryName}}/main/index.jsx`]: 'templates/app/entries/react-router-app/main/index.jsx',
  [`${srcRoot}/{{entryName}}/sample/index.jsx`]: 'templates/app/entries/react-router-app/sample/index.jsx',
  [`${srcRoot}/{{entryName}}/sample/components/SampleList.jsx`]: 'templates/app/entries/react-router-app/sample/components/SampleList.jsx',
  [`${srcRoot}/{{entryName}}/sample/constants/sample.js`]: 'templates/app/entries/react-router-app/sample/constants/sample.js',
  [`${srcRoot}/{{entryName}}/sample/containers/Sample.jsx`]: 'templates/app/entries/react-router-app/sample/containers/Sample.jsx',
  [`${srcRoot}/{{entryName}}/common/utils/index.js`]: 'templates/app/entries/react-router-app/common/utils/index.js',
  'staticweb/{{entryName}}/index.html': 'templates/staticweb/index.html',
  'staticweb/{{entryName}}/deploy.js': 'templates/staticweb/deploy.js',
};

const addReactReduxEntryFiles = {
  [`${srcRoot}/{{entryName}}/index.jsx`]: 'templates/app/entries/react-redux-app/index.jsx',
  [`${srcRoot}/{{entryName}}/main/index.jsx`]: 'templates/app/entries/react-redux-app/main/index.jsx',
  [`${srcRoot}/{{entryName}}/main/hub.js`]: 'templates/app/entries/react-redux-app/main/hub.js',
  [`${srcRoot}/{{entryName}}/main/containers/Layout.jsx`]: 'templates/app/entries/react-redux-app/main/containers/Layout.jsx',
  [`${srcRoot}/{{entryName}}/main/ducks/renameMe.js`]: 'templates/app/entries/react-redux-app/main/ducks/renameMe.js',
  [`${srcRoot}/{{entryName}}/sample/index.jsx`]: 'templates/app/entries/react-redux-app/sample/index.jsx',
  [`${srcRoot}/{{entryName}}/sample/hub.js`]: 'templates/app/entries/react-redux-app/sample/hub.js',
  [`${srcRoot}/{{entryName}}/sample/ducks/sample.js`]: 'templates/app/entries/react-redux-app/sample/ducks/sample.js',
  [`${srcRoot}/{{entryName}}/sample/ducks/actions/sample.js`]: 'templates/app/entries/react-redux-app/sample/ducks/actions/sample.js',
  [`${srcRoot}/{{entryName}}/sample/components/SampleList.jsx`]: 'templates/app/entries/react-redux-app/sample/components/SampleList.jsx',
  [`${srcRoot}/{{entryName}}/sample/constants/sample.js`]: 'templates/app/entries/react-redux-app/sample/constants/sample.js',
  [`${srcRoot}/{{entryName}}/sample/containers/Sample.jsx`]: 'templates/app/entries/react-redux-app/sample/containers/Sample.jsx',
  [`${srcRoot}/{{entryName}}/common/apis/main/index.js`]: 'templates/app/entries/react-redux-app/common/apis/main/index.js',
  [`${srcRoot}/{{entryName}}/common/apis/main/resolvers/index.js`]: 'templates/app/entries/react-redux-app/common/apis/main/resolvers/index.js',
  [`${srcRoot}/{{entryName}}/common/apis/main/resolvers/loaders/index.js`]: 'templates/app/entries/react-redux-app/common/apis/main/resolvers/loaders/index.js',
  [`${srcRoot}/{{entryName}}/common/apis/main/resolvers/__mock__/index.js`]: 'templates/app/entries/react-redux-app/common/apis/main/resolvers/__mock__/index.js',
  [`${srcRoot}/{{entryName}}/common/apis/main/schema/index.gql`]: 'templates/app/entries/react-redux-app/common/apis/main/schema/index.gql',
  'staticweb/{{entryName}}/index.html': 'templates/staticweb/index.html',
  'staticweb/{{entryName}}/deploy.js': 'templates/staticweb/deploy.js',
};

const addReactReduxRouterEntryFiles = {
  [`${srcRoot}/{{entryName}}/index.jsx`]: 'templates/app/entries/react-redux-router-app/index.jsx',
  [`${srcRoot}/{{entryName}}/main/index.jsx`]: 'templates/app/entries/react-redux-router-app/main/index.jsx',
  [`${srcRoot}/{{entryName}}/main/hub.js`]: 'templates/app/entries/react-redux-router-app/main/hub.js',
  [`${srcRoot}/{{entryName}}/main/containers/Layout.jsx`]: 'templates/app/entries/react-redux-router-app/main/containers/Layout.jsx',
  [`${srcRoot}/{{entryName}}/main/ducks/renameMe.js`]: 'templates/app/entries/react-redux-router-app/main/ducks/renameMe.js',
  [`${srcRoot}/{{entryName}}/sample/index.jsx`]: 'templates/app/entries/react-redux-router-app/sample/index.jsx',
  [`${srcRoot}/{{entryName}}/sample/hub.js`]: 'templates/app/entries/react-redux-router-app/sample/hub.js',
  [`${srcRoot}/{{entryName}}/sample/ducks/sample.js`]: 'templates/app/entries/react-redux-router-app/sample/ducks/sample.js',
  [`${srcRoot}/{{entryName}}/sample/ducks/actions/sample.js`]: 'templates/app/entries/react-redux-router-app/sample/ducks/actions/sample.js',
  [`${srcRoot}/{{entryName}}/sample/components/SampleList.jsx`]: 'templates/app/entries/react-redux-router-app/sample/components/SampleList.jsx',
  [`${srcRoot}/{{entryName}}/sample/constants/sample.js`]: 'templates/app/entries/react-redux-router-app/sample/constants/sample.js',
  [`${srcRoot}/{{entryName}}/sample/containers/Sample.jsx`]: 'templates/app/entries/react-redux-router-app/sample/containers/Sample.jsx',
  [`${srcRoot}/{{entryName}}/common/utils/index.js`]: 'templates/app/entries/react-redux-router-app/common/utils/index.js',
  [`${srcRoot}/{{entryName}}/common/apis/main/index.js`]: 'templates/app/entries/react-redux-router-app/common/apis/main/index.js',
  [`${srcRoot}/{{entryName}}/common/apis/main/resolvers/index.js`]: 'templates/app/entries/react-redux-router-app/common/apis/main/resolvers/index.js',
  [`${srcRoot}/{{entryName}}/common/apis/main/resolvers/loaders/index.js`]: 'templates/app/entries/react-redux-router-app/common/apis/main/resolvers/loaders/index.js',
  [`${srcRoot}/{{entryName}}/common/apis/main/resolvers/__mock__/index.js`]: 'templates/app/entries/react-redux-router-app/common/apis/main/resolvers/__mock__/index.js',
  [`${srcRoot}/{{entryName}}/common/apis/main/schema/index.gql`]: 'templates/app/entries/react-redux-router-app/common/apis/main/schema/index.gql',
  'staticweb/{{entryName}}/index.html': 'templates/staticweb/index.html',
  'staticweb/{{entryName}}/deploy.js': 'templates/staticweb/deploy.js',
};

function filesToActions(files) {
  const actions = [];
  for (const target in files) {
    const template = files[target];
    actions.push({
      type: 'add',
      path: path.join(projectPath, target),
      templateFile: path.join(modulePath, template),
    });
  }
  return actions;
}

module.exports = function(plop) {
  if (customPlopfile) {
    customPlopfile(plop);
  }

  const getEntryOpt = opt => {
    const updateEnvConfig = {
      type: 'modify',
      pattern: /([\s\S]*)/,
      template:
        '$1\n\nWEBCUBE_ENTRY_{{constantCase entryName}}="./staticweb/{{entryName}}/deploy.js"',
    };
    return {
      description: opt.description,
      prompts: [
        {
          type: 'input',
          name: 'entryName',
          message:
            'What is the name of new entry point? (hyphen-separated lowercase, i.e. "about-page")',
          validate,
        },
      ],
      actions: () =>
        opt.actions.concat([
          Object.assign(
            {
              path: path.join(projectPath, 'env.config'),
            },
            updateEnvConfig
          ),
          Object.assign(
            {
              path: path.join(projectPath, 'configs/env.sample.config'),
            },
            updateEnvConfig
          ),
        ]),
    };
  };

  const addReactEntryActions = [].concat(filesToActions(addReactEntryFiles));

  plop.setGenerator(
    'entry:react',
    getEntryOpt({
      description: 'Add a new entry point (with React)',
      actions: addReactEntryActions,
    })
  );

  const addReactRouterEntryActions = [].concat(
    filesToActions(addReactRouterEntryFiles)
  );

  plop.setGenerator(
    'entry:react-router',
    getEntryOpt({
      description: 'Add a new entry point (with React + Router)',
      actions: addReactRouterEntryActions,
    })
  );

  const addReactReduxEntryActions = [].concat(
    filesToActions(addReactReduxEntryFiles)
  );

  plop.setGenerator(
    'entry:react-redux',
    getEntryOpt({
      description: 'Add a new entry point (with React + Redux)',
      actions: addReactReduxEntryActions,
    })
  );

  const addReactReduxRouterEntryActions = [].concat(
    filesToActions(addReactReduxRouterEntryFiles)
  );

  plop.setGenerator(
    'entry:react-redux-router',
    getEntryOpt({
      description: 'Add a new entry point (with React + Redux + Router)',
      actions: addReactReduxRouterEntryActions,
    })
  );

  const getDemoOpt = opt => {
    const updateEnvConfig = {
      type: 'modify',
      pattern: /([\s\S]*)/,
      template:
        '$1\n\nWEBCUBE_{{constantCase entryName}}="./staticweb/{{entryName}}/deploy.js"',
    };
    return {
      description: opt.description,
      prompts: [
        {
          type: 'input',
          name: 'entryName',
          message:
            'What is the name of new entry point? (hyphen-separated lowercase, begin with "demo-", i.e. "demo-app")',
          validate(value) {
            const res = validate(value);
            if (res !== true) {
              return res;
            }
            if (/^demo-/.test(value)) {
              return true;
            }
            return 'Wrong, a demo entry\'s name must begin with "demo-", i.e. "demo-app"';
          },
        },
      ],
      actions: () =>
        opt.actions.concat([
          Object.assign(
            {
              path: path.join(projectPath, 'env.config'),
            },
            updateEnvConfig
          ),
          Object.assign(
            {
              path: path.join(projectPath, 'configs/env.sample.config'),
            },
            updateEnvConfig
          ),
        ]),
    };
  };

  plop.setGenerator(
    'demo:react',
    getDemoOpt({
      description: 'Add a new entry point for demo (with React)',
      actions: addReactEntryActions,
    })
  );

  plop.setGenerator(
    'demo:react-router',
    getDemoOpt({
      description: 'Add a new entry point for demo (with React + Router)',
      actions: addReactRouterEntryActions,
    })
  );

  plop.setGenerator(
    'demo:react-redux',
    getDemoOpt({
      description: 'Add a new entry point for demo (with React + Redux)',
      actions: addReactReduxEntryActions,
    })
  );

  plop.setGenerator(
    'demo:react-redux-router',
    getDemoOpt({
      description:
        'Add a new entry point for demo (with React + Redux + Router)',
      actions: addReactReduxRouterEntryActions,
    })
  );
};

function validate(value) {
  if (/^[a-z][a-z0-9-]+$/.test(value)) {
    return true;
  }
  return 'wrong format';
}
