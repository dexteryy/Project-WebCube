import React from 'react';

import cube from '../cube';
import styles from '../../common/styles/info.scss';
import withNotify from '../../common/hoc/withNotify';
import withBlockUi from '../../common/hoc/withBlockUi';
import ShopList from '../../common/components/ShopList';

function Shops(props) {
  return (
    <div className={styles.box}>
      <h2>CRUD API</h2>
      <ShopList {...props} />
    </div>
  );
}

export default Shops
  |> withNotify()
  |> withBlockUi()
  |> cube.connect({
    selectSource: [state => state.shops],
  });
