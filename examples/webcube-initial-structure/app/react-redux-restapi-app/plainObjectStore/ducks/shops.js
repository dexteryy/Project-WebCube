import gql from 'graphql-tag';

import hub from '../hub';
import { source } from '../../common/apis/shops';

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
      shops(shopId: $id, shopData: $data) {
        ...shopFields
      }
      timestamp
    }

    mutation updateShop($id: ID!, $data: JSON!) {
      shops(shopId: $id, shopData: $data) {
        ...shopFields
      }
      timestamp
    }

    mutation deleteShop($id: ID!) {
      __config__ {
        combineResult: crop
      }
      shops(shopId: $id) {
        ...shopFields
      }
      timestamp
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
    {
      ...shopsSource.initialState,
    },
  )
  .with({
    ...shopsSource.actions,
  });
