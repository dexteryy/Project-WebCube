import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { createApp } from 'redux-cube';
// import { withScripts } from 'webcube';
// import googleTagManager from 'webcube/boilerplate/external/googleTagManager';

import { App as SampleApp } from '../sample';
import { reducer as renameMeReducer } from './ducks/renameMe';
import Layout from './containers/Layout';

class {{pascalCase entryName}} extends Component {
  static childContextTypes = {};

  /* eslint-disable class-methods-use-this */
  getChildContext() {
    return {};
  }

  /* eslint-enable class-methods-use-this */

  render() {
    return (
      <Layout>
        <SampleApp />
      </Layout>
    );
  }
}

export const App =
  // withScripts(
  //   googleTagManager({
  //     googleTagManagerContainerId: '',
  //   }),
  // )(
  createApp({
    reducers: {
      renameMe: renameMeReducer,
    },
    devToolsOptions: { name: '{{pascalCase entryName}}' },
  })({{pascalCase entryName}});
// );
