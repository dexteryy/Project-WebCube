/* eslint no-useless-constructor: 0 */

import './index.scss';
import React from 'react';

class WelcomeBox extends React.Component {

  static propTypes = {
    message: React.PropTypes.string.isRequired,
    bgColor: React.PropTypes.string,
  };

  static defaultProps = {
    bgColor: '#eee',
  };

  constructor(props) {
    super(props);
    // Operations usually carried out in componentWillMount go here
  }

  state = {
    isHidden: false,
  };

  _handleClick = () => {
    this.setState({ isHidden: !this.state.isHidden });
  };

  render() {
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
