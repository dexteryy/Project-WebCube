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

![iOS Safari](https://github.com/alrra/browser-logos/raw/master/src/safari-ios/safari-ios_48x48.png) | ![Android WebView](https://github.com/alrra/browser-logos/raw/master/src/android/android_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- |
iOS 7+ ✔ | Android 4+ ✔ | 11+ ✔ |

Using GraphQL schema and query language to access any data source (eg. RESTful APIs) and automatically generate reducers, actions and normalized state

```
npm install --save-dev redux-source
```

## Examples

* "react-redux-restapi-app" in [Initial Webcube Examples](https://github.com/dexteryy/Project-WebCube/tree/master/examples/webcube-initial-structure)

## Get Started

Create a data source instance for Star Wars API:

```js
// sampleApp/apis/index.js
import { createSource } from 'redux-source';

export const source = createSource({
  schema: `
    type Character {
      url: ID!
      name: String!
      height: String!
      starships: [Starship!]
    }
    type Starship {
      url: ID!
      name: String!
      model: String!
    }
    type Query {
      character(id: String!): Character
      starship(id: String!): Starship
    }
  `,
  resolvers: {
    Query: {
      character: (_, { id }) =>  hifetch({
        url: `https://swapi.co/api/people/${id}/`,
      }).send()
    },
    Character: {
      starships: (_, { id }) =>  hifetch({
        url: `https://swapi.co/api/starships/${id}/`,
      }).send(),
  },
  },
  // optional
  defaultValues: {
    Character: () => null,
    Starship: () => null,
  },
});
```

More details:

See [graphql-tools's docs](https://www.apollographql.com/docs/graphql-tools/generate-schema.html)

How to modularize the above code:

See [react-redux-restapi-app/plainObjectStore/apis](https://github.com/dexteryy/Project-WebCube/tree/master/examples/webcube-initial-structure/app/react-redux-restapi-app/plainObjectStore/apis)

Generate reducers, actions and normalized initial state:

```js
// sampleApp/ducks/index.js
import gql from 'graphql-tag';
import { source } from '../apis';

const { actions: sourceActions, reducerMap, initialState } = source(
  gql`
    query showCharacter($characterId: String!) {
      character(id: $characterId) {
        url
        name
        height
        starships {
          url
          name
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
    idAttribute: 'url', // for normalizr
  },
);

console.log(sourceActions)
// {
//   'GQL_SOURCE/SHOW_CHARACTER': asyncActionCreator,
//   'GQL_SOURCE/SHOW_CHARACTER_PENDING': actionCreator,
//   'GQL_SOURCE/SHOW_CHARACTER_SUCCESS': actionCreator,
//   'GQL_SOURCE/SHOW_CHARACTER_ERROR': actionCreator,
//   'GQL_SOURCE/SHOW_SHIP': asyncActionCreator,
//   'GQL_SOURCE/SHOW_SHIP_PENDING': actionCreator,
//   'GQL_SOURCE/SHOW_SHIP_SUCCESS': actionCreator,
//   'GQL_SOURCE/SHOW_SHIP_ERROR': actionCreator,
// }

console.log(reducerMap)
// {
//   'GQL_SOURCE/SHOW_CHARACTER_PENDING': (state, action) => { /* ... */ },
//   'GQL_SOURCE/SHOW_CHARACTER_SUCCESS': (state, action) => { /* ... */ },
//   'GQL_SOURCE/SHOW_CHARACTER_ERROR': (state, action) => { /* ... */ },
//   'GQL_SOURCE/SHOW_SHIP_PENDING': (state, action) => { /* ... */ },
//   'GQL_SOURCE/SHOW_SHIP_SUCCESS': (state, action) => { /* ... */ },
//   'GQL_SOURCE/SHOW_SHIP_ERROR': (state, action) => { /* ... */ },
// }

console.log(dinitialState)
// {
//   source: {
//     data: {
//       character: {
//         entities: {
//           character: { /* ... */ },
//           starships: { /* ... */ },
//         },
//         result: "...",
//       },
//       starship: {
//         entities: {
//           starship: { /* ... */ },
//         },
//         result: "...",
//       },
//     },
//     isLoading: false,
//     errors: [],
//   }
// }
```

How to compile GraphQL queries at the build time:

See [babel-plugin-graphql-tag](https://www.npmjs.com/package/babel-plugin-graphql-tag)

How to customize:

```js
const source = createSource({
  // ...
  namespace: 'MY_NAMESPACE',
  delimiter: '|',
})

const { actions: sourceActions, reducerMap, initialState } = source(
  // ...
);

console.log(sourceActions)
// {
//   'MY_NAMESPACE|SHOW_CHARACTER': asyncActionCreator,
//   'MY_NAMESPACE|SHOW_CHARACTER_PENDING': actionCreator,
//   'MY_NAMESPACE|SHOW_CHARACTER_SUCCESS': actionCreator,
//   'MY_NAMESPACE|SHOW_CHARACTER_ERROR': actionCreator,
//   ...
// }
```

How to use the above output with [redux-cube](https://github.com/dexteryy/Project-WebCube/blob/master/packages/redux-cube):

See [react-redux-restapi-app/](https://github.com/dexteryy/Project-WebCube/tree/master/examples/webcube-initial-structure/app/react-redux-restapi-app/)
