import update from 'immutability-helper';
import gql from 'graphql-tag';

import hub from '../hub';
import { source } from '../../common/apis/starWars';

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
        inputId: (state, { payload }) =>
          update(state, {
            characterId: { $set: payload },
          }),
        changeField: (state, { payload: { id, name, value } }) =>
          update(state, {
            source: {
              entities: {
                character: {
                  [id]: {
                    [name]: {
                      $set: value,
                    },
                  },
                },
              },
            },
          }),
      },
      ship: {
        inputId: (state, { payload }) =>
          update(state, {
            shipId: { $set: payload },
          }),
        changeField: (state, { payload: { id, name, value } }) =>
          update(state, {
            source: {
              entities: {
                ship: {
                  [id]: {
                    [name]: {
                      $set: value,
                    },
                  },
                },
              },
            },
          }),
      },
    },
    {
      characterId: '',
      shipId: '',
      ...starWarsSource.initialState,
    },
  )
  .mergeActions({
    ...starWarsSource.actions,
  });
