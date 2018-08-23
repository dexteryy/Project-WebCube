import React from 'react';
import Helmet from 'react-helmet';

import cube from '../cube';
import withNotify from '../../common/hoc/withNotify';
import withBlockUi from '../../common/hoc/withBlockUi';
import StarWarsInfo from '../../common/components/StarWarsInfo';
import Shops from './Shops';

function Info(props) {
  return (
    <div>
      <Helmet title="Plain object store - redux-source sample" />
      <StarWarsInfo {...props} />
      <Shops />
    </div>
  );
}

export default Info
  |> withNotify()
  |> withBlockUi()
  |> cube.connect({
    selectSource: [state => state.starWars],
    select: [
      state => state.starWars.characterId,
      state => state.starWars.shipId,
    ],
    transform: (characterId, shipId) => ({
      characterId,
      shipId,
    }),
  });
