/* @flow */
/* eslint no-useless-constructor: 0 */

import 'normalize.css';
import 'skeleton-css/css/skeleton.css';
import styles from './index.scss';
import React, { Component } from 'react';
import cssModules from 'react-css-modules';
import WelcomeBox from '../../components/WelcomeBox';
import pick from 'lodash/pick';

type AppViewProps = {
  message: string;
  bgColor?: string;
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
      <div className="app" styleName="app">
        <WelcomeBox {...pick(this.props, ['message', 'bgColor'])} />
        <table styleName="list">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Dave Gamache</td>
              <td>26</td>
              <td>Male</td>
              <td>San Francisco</td>
            </tr>
            <tr>
              <td>Dwayne Johnson</td>
              <td>42</td>
              <td>Male</td>
              <td>Hayward</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

}

export default cssModules(AppView, styles);
