
import styles from './App.scss';
import React, { Component } from 'react';
import cssModules from 'react-css-modules';
import {
  connect,
  actionDispatcher,
} from 'webcube/boilerplate';
import { push } from 'react-router-redux';

@connect()
@actionDispatcher({ push }, 'actions')
@cssModules(styles)
export default class App extends Component {

  render() {
    const {
      children,
      // location, actions,
    } = this.props;
    return (
      <div
        id="{{camelCase entryName}}Root"
        styleName="root">
        {children}
      </div>
    );
  }

}
