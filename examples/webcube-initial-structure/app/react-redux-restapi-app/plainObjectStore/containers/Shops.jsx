import React, { PureComponent } from 'react';
import connectSource from 'redux-source/lib/connectSource';
import { connect } from 'redux-cube';

import styles from '../../common/styles/info.scss';
import { actions as shopsActions, shopsSource } from '../ducks/shops';
import ShopList from '../../common/components/ShopList';

@connectSource(shopsSource, {
  slice: state => state.shops,
})
@connect({
  actions: shopsActions,
})
export default class Shops extends PureComponent {
  render() {
    return (
      <div className={styles.box}>
        <h2>CRUD API</h2>
        <ShopList {...this.props} />
      </div>
    );
  }
}
