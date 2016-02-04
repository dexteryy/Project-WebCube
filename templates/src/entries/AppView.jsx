/* @flow */
/* eslint no-useless-constructor: 0 */

import styles from './index.scss';
import React, { Component } from 'react';
import cssModules from 'react-css-modules';

type AppViewProps = {

};

type AppViewStates = {

};

class AppView extends Component {

  static defaultProps = {

  };

  constructor(props: AppViewProps) {
    super(props);
    // Operations usually carried out in componentWillMount go here
  }

  state: AppViewStates = {

  };

  render(): React.Element {
    return (
      <div className="{{entryName}}" styleName="app">
      </div>
    );
  }

}

export default cssModules(AppView, styles);
