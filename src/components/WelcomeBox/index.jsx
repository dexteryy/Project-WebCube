/* @flow */
/* eslint no-useless-constructor: 0 */

import './index.scss';
import React from 'react';

type WelcomeBoxProps = {
  message: string;
  bgColor?: string;
};

type WelcomeBoxStates = {
  isHidden: boolean;
};

class WelcomeBox extends React.Component {

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

  _handleClick = () => {
    this.setState({ isHidden: !this.state.isHidden });
  };

  render(): React.Element {
    const hidden = this.state.isHidden ? 'hide' : '';
    const boxStyles = {
      backgroundColor: this.props.bgColor,
    };
    return (
      <div className={`welcome ${hidden}`} style={boxStyles}>
        <div className="msg">{this.props.message}</div>
        <button className="ok"
          onClick={this._handleClick}
        >Get Started</button>
      </div>
    );
  }

}

export default WelcomeBox;
