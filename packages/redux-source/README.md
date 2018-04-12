# redux-source

[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

[![NPM Version][npm-image]][npm-url]
<!-- [![Build Status][travis-image]][travis-url]
[![Dependencies Status][dep-image]][dep-url] -->

[![Nodei][nodei-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/redux-source.svg
[nodei-image]: https://nodei.co/npm/redux-source.png?downloads=true
[npm-url]: https://npmjs.org/package/redux-source
<!--
[travis-image]: https://img.shields.io/travis/dexteryy/redux-source/master.svg
[travis-url]: https://travis-ci.org/dexteryy/redux-source
[dep-image]: https://david-dm.org/dexteryy/redux-source.svg
[dep-url]: https://david-dm.org/dexteryy/redux-source
-->

Using GraphQL [schema](http://graphql.org/learn/schema/) and [query](http://graphql.org/learn/queries/) language to access any data source (eg. RESTful APIs) and automatically generate reducers, actions and normalized state

```
npm install --save redux-source
```

For [Immutable.js](http://facebook.github.io/immutable-js/) store: [redux-source-immutable](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-source-immutable)


<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=6 orderedList=false} -->
<!-- code_chunk_output -->

* [Examples](#examples)
* [Get Started](#get-started)
	* [Create A Data Source](#create-a-data-source)
		* [`createSource`](#createsource)
		* [Schema](#schema)
		* [Resolvers](#resolvers)
	* [Create A Data Source Query](#create-a-data-source-query)
		* [Queries](#queries)
		* [Reducers, Actions and States](#reducers-actions-and-states)
		* [How To Customize](#how-to-customize)
	* [Higher-order Components](#higher-order-components)
		* [Connect To React Components](#connect-to-react-components)
		* [Notification](#notification)
		* [Block UI](#block-ui)
	* [Immutable.js Store](#immutablejs-store)

<!-- /code_chunk_output -->


## Examples

* "react-redux-restapi-app" in [Initial Webcube Examples](https://github.com/dexteryy/Project-WebCube/tree/master/examples/webcube-initial-structure)

## Get Started

For example, suppose we have a CRUD (create, read, update, delete) API for managing shops

### Create A Data Source

#### `createSource`

Create a data source instance

```js
// shopManageApp/apis/shops/index.js
import { createSource } from 'redux-source';
// for Immutable.js store:
// import { createSource } from 'redux-source-immutable';
import schema from './schema/index.gql';
import resolvers from './resolvers';

export const source = createSource({
  schema,
  resolvers,
});
```

> TIPS
> * Add [raw-loader](https://www.npmjs.com/package/raw-loader) to your [webpack.config.js](https://webpack.js.org/concepts/loaders/) for importing .gql file
>   ```
>   {
>     test: /\.(txt|gql)$/,
>     use: 'raw-loader',
>   },
>   ```

#### Schema

```graphql
# shopManageApp/apis/shops/schema/index.gql
type Shop {
  id: ID!
  name: String
  address: String
  deliveryEnabled: Boolean!
  services: [Service!]
  orders: [JSON!]
  position: Position
}
type Service {
  id: ID!
  name: String!
  price: Float!
}
type Query {
  shops: [Shop!]
}
type Mutation {
  updateShop: (shopId: String!, shopData: JSON!): [Shop!]
  deleteShop: (shopId: String!): [Shop!]
}
```

> TIPS
> * Syntax highlighting for GraphQL schema language and query language
>   * [GraphQL for VSCode](https://marketplace.visualstudio.com/items?itemName=kumar-harsh.graphql-for-vscode)
> * GraphQL schema language
>   * [Schemas and Types](http://graphql.org/learn/schema/)
>   * [Generating a schema](https://www.apollographql.com/docs/graphql-tools/generate-schema.html)
> * `JSON` type is built-in and defined by [graphql-type-json](https://www.npmjs.com/package/graphql-type-json) (["field type for object with dynamic keys"](https://stackoverflow.com/questions/46562561/apollo-graphql-field-type-for-object-with-dynamic-keys))
>   * Other built-in scalar types: `Date`, `Time`, `DateTime` ([graphql-iso-date](https://www.npmjs.com/package/graphql-iso-date))
>   * You can define your own [custom scalar](https://github.com/apollographql/graphql-tools/blob/master/docs/source/scalars.md)
> * If you want to automatically normalize (see below) the data of a field, its field name must be plural (for the above example, the field names for `Service` type and `Shop` type are `services` and `shops`) or 'xxxx_$list' when its type is a [List](http://graphql.org/learn/schema/#lists-and-non-null) and must be singular or uncountable when its type is not a [List](http://graphql.org/learn/schema/#lists-and-non-null).

#### Resolvers

```js
// shopManageApp/apis/shops/resolvers/index.js
import hifetch from 'hifetch';

const resolvers = {
  Query: {
    shops: () => hifetch({
      url: `https://example.com/api/shops`,
    }).send().then(response => response.shops),
  },
  Mutation: {
    updateShop: (_, { shopId, shopData }) =>
      hifetch({
        url: `https://example.com/api/shops/${shopId}`,
        method: 'post',
        data: shopData,
      }).send().then(response => [response.shop]),
    deleteShop: (_, { shopId }) =>
      hifetch({
        url: `https://example.com/api/shops/${shopId}`,
        method: 'delete',
      }).send().then(response => [response.shop]),
  },
  Shop {
    services: shop => hifetch({
      url: `https://example.com/api/shops/${shop.id}/services`,
    }).send().then(response => [response.services]),
  },
};

export default resolvers;
```

> TIPS
> * `createSource`'s `schema` and `resolvers` options are the same as graphql-tools's `makeExecutableSchema`
>   * [Writing resolvers with graphql-tools](https://www.apollographql.com/docs/graphql-tools/resolvers.html)
> * For more complex query or mutation operations, you can use [composition libraries](https://www.apollographql.com/docs/graphql-tools/resolvers.html#companion-tools) such as [graphql-resolvers](https://github.com/lucasconstantino/graphql-resolvers).
>   * Examples: [react-redux-restapi-app/common/apis/shops/resolvers](https://github.com/dexteryy/Project-WebCube/tree/master/examples/webcube-initial-structure/app/react-redux-restapi-app/common/apis/shops/resolvers)
> * Examples of how to modularize the above code: [react-redux-restapi-app/common/apis](https://github.com/dexteryy/Project-WebCube/tree/master/examples/webcube-initial-structure/app/react-redux-restapi-app/common/apis)

### Create A Data Source Query

#### Queries

Use [GraphQL query language](http://graphql.org/learn/queries/) to automatically generate reducers, actions and [normalized](https://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html) state:

```js
// shopManageApp/ducks/shops.js
import gql from 'graphql-tag';
import { source } from '../apis/shops';

export const shopsSource = source(
  gql`
    query fetchShops {
      __config__ {
        combineResult: replace
      }
      shops {
        ...shopFields
      }
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
      shops: deleteShop(shopId: $id) {
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
);

// use `shopsSource` to generate reducer function and action creators

export {
  reducer,
  actions,
  types,
}
```

> TIPS
> * GraphQL query language
>   * [Queries and Mutations](http://graphql.org/learn/queries/)
> * `__config__` is an extended syntax supported by redux-source
>   * `combineResult` is used to indicate how the autogenerated reducer to change the state, its value can be `merge` (default), `replace`, or `crop`
>   * Examples: [CRUD API demo](https://github.com/dexteryy/Project-WebCube/tree/master/examples/webcube-initial-structure/app/react-redux-restapi-app/plainObjectStore) in [react-redux-restapi-app](https://github.com/dexteryy/Project-WebCube/tree/master/examples/webcube-initial-structure)

#### Reducers, Actions and States

The output of source query:

```js
console.log(shopsSource.actions)
// {
//   'REDUX_SOURCE/FETCH_SHOPS': asyncActionCreator,
//   'REDUX_SOURCE/FETCH_SHOPS_PENDING': actionCreator,
//   'REDUX_SOURCE/FETCH_SHOPS_SUCCESS': actionCreator,
//   'REDUX_SOURCE/FETCH_SHOPS_ERROR': actionCreator,
//   'REDUX_SOURCE/ADD_SHOP': asyncActionCreator,
//   'REDUX_SOURCE/ADD_SHOP_PENDING': actionCreator,
//   'REDUX_SOURCE/ADD_SHOP_SUCCESS': actionCreator,
//   'REDUX_SOURCE/ADD_SHOP_ERROR': actionCreator,
//   'REDUX_SOURCE/UPDATE_SHOP': asyncActionCreator,
//   'REDUX_SOURCE/UPDATE_SHOP_PENDING': actionCreator,
//   'REDUX_SOURCE/UPDATE_SHOP_ERROR': actionCreator,
//   'REDUX_SOURCE/UPDATE_SHOP_SUCCESS': actionCreator,
//   'REDUX_SOURCE/DELETE_SHOP': asyncActionCreator,
//   'REDUX_SOURCE/DELETE_SHOP_PENDING': actionCreator,
//   'REDUX_SOURCE/DELETE_SHOP_ERROR': actionCreator,
//   'REDUX_SOURCE/DELETE_SHOP_SUCCESS': actionCreator,
// }

console.log(shopsSource.reducerMap)
// {
//   'REDUX_SOURCE/FETCH_SHOPS_PENDING': reducer,
//   'REDUX_SOURCE/FETCH_SHOPS_SUCCESS': reducer,
//   'REDUX_SOURCE/FETCH_SHOPS_ERROR': reducer,
//   'REDUX_SOURCE/ADD_SHOP_PENDING': reducer,
//   'REDUX_SOURCE/ADD_SHOP_SUCCESS': reducer,
//   'REDUX_SOURCE/ADD_SHOP_ERROR': reducer,
//   'REDUX_SOURCE/UPDATE_SHOP_PENDING': reducer,
//   'REDUX_SOURCE/UPDATE_SHOP_ERROR': reducer,
//   'REDUX_SOURCE/UPDATE_SHOP_SUCCESS': reducer,
//   'REDUX_SOURCE/DELETE_SHOP_PENDING': reducer,
//   'REDUX_SOURCE/DELETE_SHOP_ERROR': reducer,
//   'REDUX_SOURCE/DELETE_SHOP_SUCCESS': reducer,
// }

console.log(shopsSource.initialState)
// {
//   source: {
//     result: {},
//     entities: {},
//     isPending: false,
//     errors: [],
//   }
// }
```

> TIPS
> * How to compile GraphQL queries at the build time
>   * [babel-plugin-graphql-tag](https://www.npmjs.com/package/babel-plugin-graphql-tag)
> * How to use the output of source query (like `shopsSource`) with [redux-cube](https://github.com/dexteryy/Project-WebCube/blob/master/packages/redux-cube)
>   * Example: [webcube-initial-structure](https://github.com/dexteryy/Project-WebCube/tree/master/examples/webcube-initial-structure/)'s [react-redux-restapi-app//plainObjectStore/ducks/*.js](https://github.com/dexteryy/Project-WebCube/blob/master/examples/webcube-initial-structure/app/react-redux-restapi-app/plainObjectStore/ducks/)

How will the action creators (`shopsSource.actions`) and reducers (`shopsSource.reducerMap`) change the state slice (`shopsSource.initialState`):

```js
shopsSource.actions.reduxSource.fetchShops()
// state slice:
// {
//   source: {
//     result: {
//       shops: ['shop-id-0001', 'shop-id-0002'],
//     },
//     entities: {
//       shop: {
//         'shop-id-0001': {
//           id: 'shop-id-0001',
//           name: 'Shop A',
//           services: ['service-id-0001', 'serivce-id-0001'],
//           position: {
//             latitude: '...',
//             longitude: '...',
//           },
//           ...
//         },
//         'shop-id-0002': {
//           id: 'shop-id-0002',
//           name: 'Shop B',
//           services: ['shop-id-0002', 'shop-id-0003'],
//           position: {
//             latitude: '...',
//             longitude: '...',
//           },
//           ...
//         },
//       },
//       service: {
//         'service-id-0001': {
//           name: 'Service A',
//           ...
//         },
//         'service-id-0002': {
//           ...
//         },
//         'service-id-0003': {
//           ...
//         },
//       },
//     },
//     isPending: false,
//     errors: [],
//   }
// }

shopsSource.actions.reduxSource.addShop({
  id: 'shop-id-0003',
  data: {
    name: 'Shop C',
    services: [{
      id: 'shop-id-0004',
      name: 'Service D',
      // ...
    }],
    // ...
  },
})
// state slice:
// {
//   source: {
//     result: {
//       shops: ['shop-id-0001', 'shop-id-0002', 'shop-id-0003'],
//     },
//     entities: {
//       shop: {
//         'shop-id-0001': {
//           ...
//         },
//         'shop-id-0002': {
//           ...
//         },
//         'shop-id-0003': {
//           id: 'shop-id-0003',
//           name: 'Shop C',
//           ...
//         },
//       },
//       service: {
//         'service-id-0001': {
//           ...
//         },
//         'service-id-0002': {
//           ...
//         },
//         'service-id-0003': {
//           ...
//         },
//         'service-id-0004': {
//           name: 'Service D',
//           ...
//         },
//       },
//     },
//     isPending: false,
//     errors: [],
//   }
// }

shopsSource.actions.reduxSource.updateShop({
  id: 'shop-id-0001',
  data: {
    name: 'Shop A (modified)',
    // ...
  },
})
// state slice:
// {
//   source: {
//     result: {
//       shops: ['shop-id-0001', 'shop-id-0002', 'shop-id-0003'],
//     },
//     entities: {
//       shop: {
//         'shop-id-0001': {
//           id: 'shop-id-0001',
//           name: 'Shop A (modified)',
//           ...
//         },
//         'shop-id-0002': {
//           ...
//         },
//         'shop-id-0003': {
//           ...
//         },
//       },
//       service: {
//         ...
//       },
//     },
//     isPending: false,
//     errors: [],
//   }
// }

shopsSource.actions.reduxSource.deleteShop({
  id: 'shop-id-0002',
})
// state slice:
// {
//   source: {
//     result: {
//       shops: ['shop-id-0001', 'shop-id-0003'],
//     },
//     entities: {
//       shop: {
//         'shop-id-0001': {
//           ...
//         },
//         'shop-id-0002': {
//           ...
//         },
//         'shop-id-0003': {
//           ...
//         },
//       },
//       service: {
//         'service-id-0001': {
//           ...
//         },
//         'service-id-0002': {
//           ...
//         },
//         'service-id-0003': {
//           ...
//         },
//         'service-id-0004': {
//           ...
//         },
//       },
//     },
//     isPending: false,
//     errors: [],
//   }
// }
```

> TIPS
> * redux-source can automatically generate the schema definition for [normalizr](https://www.npmjs.com/package/normalizr) and automatically [normalize](https://github.com/paularmstrong/normalizr/blob/HEAD/docs/api.md#normalizedata-schema) the output of GraphQL resolvers (equal to `shopsSource.normalize(outputOfAllResolvers)`)
> * The `position` field in the result is not normalized because it does not contain an `id` field
>   * The name of the `id` field can be customized by `idAttribute` option (see below)

#### How To Customize

```js
const shopsSource = source(
  gql`
    ...
  `,
  {
    // for normalize
    // default value is 'id'
    idAttribute: 'otherId',
    // for state slice
    stateName: 'shopsSource',
    // for action types
    namespace: 'SHOPS_NAMESPACE',
    // for action types
    delimiter: '|',
  }
})

console.log(shopsSource.actions)
// {
//   'SHOPS_NAMESPACE|FETCH_SHOPS': asyncActionCreator,
//   'SHOPS_NAMESPACE|FETCH_SHOPS_PENDING': actionCreator,
//   'SHOPS_NAMESPACE|FETCH_SHOPS_SUCCESS': actionCreator,
//   'SHOPS_NAMESPACE|FETCH_SHOPS_ERROR': actionCreator,
//   ...
//   'SHOPS_NAMESPACE|DELETE_SHOP_SUCCESS': actionCreator,
// }

console.log(shopsSource.initialState)
// {
//   shopsSource: {
//     result: {},
//     entities: {},
//     isPending: false,
//     errors: [],
//   }
// }
```

### Higher-order Components

#### Connect To React Components

See [redux-source-connect](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-source-connect)


#### Notification

See [redux-source-with-notify](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-source-with-block-ui)

#### Block UI

See [redux-source-with-block-ui](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-source-with-block-ui)

### Immutable.js Store

Examples for [Immutable.js](http://facebook.github.io/immutable-js/) store: [app/react-redux-restapi-app/immutableJsStore](https://github.com/dexteryy/Project-WebCube/tree/master/examples/webcube-initial-structure/app/react-redux-restapi-app/immutableJsStore)
