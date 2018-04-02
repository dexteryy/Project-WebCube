import React, { Component, Fragment } from 'react';
import onClickOutside from 'react-onclickoutside';

@onClickOutside
export default class DetectClickOutSide extends Component {
  handleClickOutside() {
    this.props.onClickOutSide();
  }

  render() {
    return <Fragment>{this.props.children}</Fragment>;
  }
}
