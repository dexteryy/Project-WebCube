/* @flow */
/* eslint no-useless-constructor: 0 */

import styles from './index.scss';
import React, { Component } from 'react';
import cssModules from 'react-css-modules';
import debounce from 'lodash/debounce';

type WelcomeBoxProps = {
  message: string;
  bgColor?: string;
};

type WelcomeBoxStates = {
  isHidden: boolean;
};

class WelcomeBox extends Component {

  static defaultProps = {
    bgColor: '#eee',
  };

  constructor(props: WelcomeBoxProps) {
    super(props);
    // Operations usually carried out in componentWillMount go here
  }

  state: WelcomeBoxStates = {
    isHidden: false,
  };

  _handleClick = debounce(() => {
    this.setState({ isHidden: !this.state.isHidden });
  }, 500);

  render(): React.Element {
    const boxStyle = this.state.isHidden ? 'box-hide' : 'box';
    const boxCustomStyles = {
      backgroundColor: this.props.bgColor,
    };
    return (
      <div className="welcome-box" styleName={boxStyle} style={boxCustomStyles}>
        <div className="msg" styleName="msg">{this.props.message}</div>
        <button styleName="ok"
          onClick={this._handleClick}
        >Get Started</button>
      </div>
    );
  }

}

export default cssModules(WelcomeBox, styles);
