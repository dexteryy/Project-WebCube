// https://github.com/amwmedia/plop

const path = require('path');
const { rootPath, modulePath } = require('../utils');

let customPlopfile;
try {
  customPlopfile = require(path.join(
    rootPath,
    `${process.env.WEBCUBE_CUSTOM_CONFIG_ROOT}/plopfile.js`
  ));
} catch (ex) {
  console.info('No custom plopfile');
}

module.exports = function(plop) {
  if (customPlopfile) {
    customPlopfile(plop);
  }

  const addReactEntryActions = [
    {
      type: 'add',
      path: path.join(rootPath, 'app/{{entryName}}/index.jsx'),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-app/index.jsx'
      ),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'app/{{entryName}}/sample/index.jsx'),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-app/sample/index.jsx'
      ),
    },
    {
      type: 'add',
      path: path.join(
        rootPath,
        'app/{{entryName}}/sample/components/SampleList.jsx'
      ),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-app/sample/components/SampleList.jsx'
      ),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'app/{{entryName}}/sample/constants/sample.js'),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-app/sample/constants/sample.js'
      ),
    },
    {
      type: 'add',
      path: path.join(
        rootPath,
        'app/{{entryName}}/sample/containers/Sample.jsx'
      ),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-app/sample/containers/Sample.jsx'
      ),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'staticweb/{{entryName}}/index.html'),
      templateFile: path.join(modulePath, 'templates/staticweb/index.html'),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'staticweb/{{entryName}}/deploy.js'),
      templateFile: path.join(modulePath, 'templates/staticweb/deploy.js'),
    },
  ];

  const addReactRouterEntryActions = [
    {
      type: 'add',
      path: path.join(rootPath, 'app/{{entryName}}/index.jsx'),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-router-app/index.jsx'
      ),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'app/{{entryName}}/sample/index.jsx'),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-router-app/sample/index.jsx'
      ),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'app/{{entryName}}/common/utils/index.js'),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-router-app/common/utils/index.js'
      ),
    },
    {
      type: 'add',
      path: path.join(
        rootPath,
        'app/{{entryName}}/sample/components/SampleList.jsx'
      ),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-router-app/sample/components/SampleList.jsx'
      ),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'app/{{entryName}}/sample/constants/sample.js'),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-router-app/sample/constants/sample.js'
      ),
    },
    {
      type: 'add',
      path: path.join(
        rootPath,
        'app/{{entryName}}/sample/containers/Sample.jsx'
      ),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-router-app/sample/containers/Sample.jsx'
      ),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'staticweb/{{entryName}}/index.html'),
      templateFile: path.join(modulePath, 'templates/staticweb/index.html'),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'staticweb/{{entryName}}/deploy.js'),
      templateFile: path.join(modulePath, 'templates/staticweb/deploy.js'),
    },
  ];

  const addReactReduxEntryActions = [
    {
      type: 'add',
      path: path.join(rootPath, 'app/{{entryName}}/index.jsx'),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-redux-app/index.jsx'
      ),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'app/{{entryName}}/sample/index.jsx'),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-redux-app/sample/index.jsx'
      ),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'app/{{entryName}}/sample/hub.js'),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-redux-app/sample/hub.js'
      ),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'app/{{entryName}}/sample/actions/sample.js'),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-redux-app/sample/actions/sample.js'
      ),
    },
    {
      type: 'add',
      path: path.join(
        rootPath,
        'app/{{entryName}}/sample/components/SampleList.jsx'
      ),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-redux-app/sample/components/SampleList.jsx'
      ),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'app/{{entryName}}/sample/constants/sample.js'),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-redux-app/sample/constants/sample.js'
      ),
    },
    {
      type: 'add',
      path: path.join(
        rootPath,
        'app/{{entryName}}/sample/containers/Sample.jsx'
      ),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-redux-app/sample/containers/Sample.jsx'
      ),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'app/{{entryName}}/sample/reducers/sample.js'),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-redux-app/sample/reducers/sample.js'
      ),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'staticweb/{{entryName}}/index.html'),
      templateFile: path.join(modulePath, 'templates/staticweb/index.html'),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'staticweb/{{entryName}}/deploy.js'),
      templateFile: path.join(modulePath, 'templates/staticweb/deploy.js'),
    },
  ];

  const addReactReduxRouterEntryActions = [
    {
      type: 'add',
      path: path.join(rootPath, 'app/{{entryName}}/index.jsx'),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-redux-router-app/index.jsx'
      ),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'app/{{entryName}}/sample/index.jsx'),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-redux-router-app/sample/index.jsx'
      ),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'app/{{entryName}}/sample/hub.js'),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-redux-router-app/sample/hub.js'
      ),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'app/{{entryName}}/common/utils/index.js'),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-redux-router-app/common/utils/index.js'
      ),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'app/{{entryName}}/sample/actions/sample.js'),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-redux-router-app/sample/actions/sample.js'
      ),
    },
    {
      type: 'add',
      path: path.join(
        rootPath,
        'app/{{entryName}}/sample/components/SampleList.jsx'
      ),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-redux-router-app/sample/components/SampleList.jsx'
      ),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'app/{{entryName}}/sample/constants/sample.js'),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-redux-router-app/sample/constants/sample.js'
      ),
    },
    {
      type: 'add',
      path: path.join(
        rootPath,
        'app/{{entryName}}/sample/containers/Sample.jsx'
      ),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-redux-router-app/sample/containers/Sample.jsx'
      ),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'app/{{entryName}}/sample/reducers/sample.js'),
      templateFile: path.join(
        modulePath,
        'templates/app/entries/react-redux-router-app/sample/reducers/sample.js'
      ),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'staticweb/{{entryName}}/index.html'),
      templateFile: path.join(modulePath, 'templates/staticweb/index.html'),
    },
    {
      type: 'add',
      path: path.join(rootPath, 'staticweb/{{entryName}}/deploy.js'),
      templateFile: path.join(modulePath, 'templates/staticweb/deploy.js'),
    },
  ];

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
              path: path.join(rootPath, 'env.config'),
            },
            updateEnvConfig
          ),
          Object.assign(
            {
              path: path.join(rootPath, 'configs/env.sample.config'),
            },
            updateEnvConfig
          ),
        ]),
    };
  };

  plop.setGenerator(
    'entry:react',
    getEntryOpt({
      description: 'Add a new entry point (with React)',
      actions: addReactEntryActions,
    })
  );

  plop.setGenerator(
    'entry:react-router',
    getEntryOpt({
      description: 'Add a new entry point (with React + Router)',
      actions: addReactRouterEntryActions,
    })
  );

  plop.setGenerator(
    'entry:react-redux',
    getEntryOpt({
      description: 'Add a new entry point (with React + Redux)',
      actions: addReactReduxEntryActions,
    })
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
              path: path.join(rootPath, 'env.config'),
            },
            updateEnvConfig
          ),
          Object.assign(
            {
              path: path.join(rootPath, 'configs/env.sample.config'),
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
