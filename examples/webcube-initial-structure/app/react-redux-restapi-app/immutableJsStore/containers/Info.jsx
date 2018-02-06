import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import connectSource from 'redux-source-immutable/lib/connectSource';
import { connect } from 'redux-cube';

import { actions as starWarsActions, starWarsSource } from '../ducks/starWars';
import StarWarsInfo from '../../common/components/StarWarsInfo';
import Shops from './Shops';

@connectSource(starWarsSource, {
  slice: state => state.get('starWars'),
})
@connect({
  selectors: [
    state => state.getIn(['starWars', 'characterId']),
    state => state.getIn(['starWars', 'shipId']),
  ],
  transform: (characterId, shipId) => ({
    characterId,
    shipId,
  }),
  actions: starWarsActions,
})
export default class Info extends PureComponent {
  render() {
    return (
      <div>
        <Helmet
          title="React + Redux + Restful API App - Immutable.js Shop"
          meta={[{ name: 'description', content: '' }]}
        />
        <StarWarsInfo {...this.props} />
        <Shops />
      </div>
    );
  }
}
