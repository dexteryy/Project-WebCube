import { Map } from 'immutable';
import gql from 'graphql-tag';

import hub from '../hub';
import { source } from '../apis';

export const starWarsSource = source(
  gql`
    query showCharacter($characterId: String!) {
      character(id: $characterId) {
        url
        name
        height
        starships {
          url
          name
          model
          films {
            url
            title
            director
            created
          }
        }
      }
    }

    query showShip($shipId: String!) {
      starship(id: $shipId) {
        url
        name
        model
      }
    }
  `,
  {
    stateName: 'source',
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
        changeField: (state, { payload: { name, value } }) =>
          state.setIn(
            [
              'source',
              'data',
              'character',
              'entities',
              'character',
              state.getIn(['source', 'data', 'character', 'result']),
              name,
            ],
            value,
          ),
      },
      starship: {
        inputId: (state, { payload }) => state.set('shipId', payload),
        changeField: (state, { payload: { name, value } }) =>
          state.setIn(
            [
              'source',
              'data',
              'starship',
              'entities',
              'starship',
              state.getIn(['source', 'data', 'starship', 'result']),
              name,
            ],
            value,
          ),
      },
    },
    Map({
      characterId: '',
      shipId: '',
    }).merge(starWarsSource.initialState),
  )
  .with(starWarsSource.actions);
