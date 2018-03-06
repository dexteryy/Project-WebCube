import React, { PureComponent } from 'react';
import connectSource from 'redux-source-connect';
import { connect } from 'redux-cube';

import { actions, reduxSource } from '../ducks/renameMe';

@connectSource(reduxSource, {
  slice: state => state.renameMe,
})
@connect({
  actions,
})
export default class Layout extends PureComponent {
  render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }
}
