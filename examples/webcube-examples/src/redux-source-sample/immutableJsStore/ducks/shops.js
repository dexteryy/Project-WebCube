import { fromJS } from 'immutable';
import gql from 'graphql-tag';

import hub from '../hub';
import { source } from '../../common/apis/shops/immutable';

export const shopsSource = source(
  gql`
    query fetchShops {
      __config__ {
        combineResult: replace
      }
      shops {
        ...shopFields
      }
      timestamp
    }

    mutation addShop($id: ID!, $data: JSON!) {
      shops: updateShop(shopId: $id, shopData: $data) {
        ...shopFields
      }
    }

    mutation updateShop($id: ID!, $data: JSON!) {
      shops: updateShop(shopId: $id, shopData: $data) {
        ...shopFields
      }
    }

    mutation deleteShop($id: ID!) {
      __config__ {
        combineResult: crop
      }
      shops: removeShop(shopId: $id) {
        ...shopFields
      }
    }

    fragment shopFields on Shop {
      id
      name
      address
      deliveryEnabled
      services {
        id
        name
        price
      }
      orders
      position {
        latitude
        longitude
      }
    }
  `,
  {
    namespace: 'SHOPS_SOURCE',
  },
);

export const { reducer, actions, types, typeDict } = hub
  .handle(
    {
      ...shopsSource.reducerMap,
    },
    fromJS({}).merge(shopsSource.initialState),
  )
  .mergeActions({
    ...shopsSource.actions,
  });
