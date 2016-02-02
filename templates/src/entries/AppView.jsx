/* @flow */
/* eslint no-useless-constructor: 0 */

import React from 'react';

type AppViewProps = {

};

type AppViewStates = {

};

class AppView extends React.Component {

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
      <div className="{{entryName}}">
      </div>
    );
  }

}

export default AppView;
