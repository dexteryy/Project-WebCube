import { fromJS } from 'immutable';
import gql from 'graphql-tag';

import hub from '../hub';
import { source } from '../../common/apis/starWars/immutable';

export const starWarsSource = source(
  gql`
    query showCharacter($characterId: String!) {
      __config__ {
        combineResult: replace
      }
      character(id: $characterId) {
        url
        name
        height
        ships: starships {
          ...shipFields
        }
      }
    }

    query showShip($shipId: String!) {
      ship: starship(id: $shipId) {
        ...shipFields
      }
    }

    fragment shipFields on Starship {
      url
      name
      model
      films {
        url
        name: title
        director
        created
      }
    }
  `,
  {
    namespace: 'STAR_WARS_SOURCE',
    idAttribute: 'url',
  },
);

export const { reducer, actions, types, typeDict } = hub
  .handle(
    {
      ...starWarsSource.reducerMap,
      character: {
        inputId: (state, { payload }) => state.set('characterId', payload),
        changeField: (state, { payload: { id, name, value } }) =>
          state.setIn(['source', 'entities', 'character', id, name], value),
      },
      ship: {
        inputId: (state, { payload }) => state.set('shipId', payload),
        changeField: (state, { payload: { id, name, value } }) =>
          state.setIn(['source', 'entities', 'ship', id, name], value),
      },
    },
    fromJS({
      characterId: '',
      shipId: '',
    }).merge(starWarsSource.initialState),
  )
  .mergeActions({
    ...starWarsSource.actions,
  });
