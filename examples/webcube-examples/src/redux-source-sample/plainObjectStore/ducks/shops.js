import gql from 'graphql-tag';
import cube from '../cube';
import { source } from '../../common/apis/shops';

cube.handle(
  'shops',
  source(
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
  ),
);
