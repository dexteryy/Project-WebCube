import React, { PureComponent } from 'react';
import connectSource from 'redux-source-connect';
import { connect } from 'redux-cube';

import styles from '../../common/styles/info.scss';
import { actions as shopsActions, shopsSource } from '../ducks/shops';
import withNotify from '../../common/hoc/withNotify';
import withBlockUi from '../../common/hoc/withBlockUi';
import ShopList from '../../common/components/ShopList';

@connectSource(shopsSource, {
  slice: state => state.shops,
})
@connect({
  actions: shopsActions,
})
@withBlockUi()
@withNotify()
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
