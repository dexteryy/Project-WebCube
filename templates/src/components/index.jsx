/* @flow */
/* eslint no-useless-constructor: 0 */

import styles from './index.scss';
import React, { Component } from 'react';
import cssModules from 'react-css-modules';

type {{pascalCase componentName}}Props = {

};

type {{pascalCase componentName}}States = {

};

class {{pascalCase componentName}} extends Component {

  static defaultProps = {

  };

  constructor(props: {{pascalCase componentName}}Props) {
    super(props);
    // Operations usually carried out in componentWillMount go here
  }

  state: {{pascalCase componentName}}States = {

  };

  render(): React.Element {
    return (
      <div className="{{dashCase componentName}}" styleName="root">
      </div>
    );
  }

}

export default cssModules({{pascalCase componentName}}, styles);
