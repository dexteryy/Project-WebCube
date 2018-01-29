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
// starWarsApp/apis/index.js
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
});
```

More details:

See [graphql-tools's docs](https://www.apollographql.com/docs/graphql-tools/generate-schema.html)

How to modularize the above code:

See [react-redux-restapi-app/plainObjectStore/apis](https://github.com/dexteryy/Project-WebCube/tree/master/examples/webcube-initial-structure/app/react-redux-restapi-app/plainObjectStore/apis)

Generate reducers, actions and normalized initial state:

```js
// starWarsApp/ducks/starWars.js
import gql from 'graphql-tag';
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

console.log(starWarsSource.actions)
// {
//   'REDUX_SOURCE/SHOW_CHARACTER': asyncActionCreator,
//   'REDUX_SOURCE/SHOW_CHARACTER_PENDING': actionCreator,
//   'REDUX_SOURCE/SHOW_CHARACTER_SUCCESS': actionCreator,
//   'REDUX_SOURCE/SHOW_CHARACTER_ERROR': actionCreator,
//   'REDUX_SOURCE/SHOW_SHIP': asyncActionCreator,
//   'REDUX_SOURCE/SHOW_SHIP_PENDING': actionCreator,
//   'REDUX_SOURCE/SHOW_SHIP_SUCCESS': actionCreator,
//   'REDUX_SOURCE/SHOW_SHIP_ERROR': actionCreator,
// }

console.log(starWarsSource.reducerMap)
// {
//   'REDUX_SOURCE/SHOW_CHARACTER_PENDING': (state, action) => { /* ... */ },
//   'REDUX_SOURCE/SHOW_CHARACTER_SUCCESS': (state, action) => { /* ... */ },
//   'REDUX_SOURCE/SHOW_CHARACTER_ERROR': (state, action) => { /* ... */ },
//   'REDUX_SOURCE/SHOW_SHIP_PENDING': (state, action) => { /* ... */ },
//   'REDUX_SOURCE/SHOW_SHIP_SUCCESS': (state, action) => { /* ... */ },
//   'REDUX_SOURCE/SHOW_SHIP_ERROR': (state, action) => { /* ... */ },
// }

console.log(starWarsSource.initialState)
// {
//   source: {
//     data: {},
//     isPending: false,
//     errors: [],
//   }
// }

starWarsSource.actions.reduxSource.showCharacter({ characterId: '1' })
starWarsSource.actions.reduxSource.showShip({ shipId: '10' })
console.log(state)
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
//     isPending: false,
//     errors: [],
//   }
// }
```

How to compile GraphQL queries at the build time:

See [babel-plugin-graphql-tag](https://www.npmjs.com/package/babel-plugin-graphql-tag)

How to customize:

```js
const starWarsSource = source(
  `
    ...
  `,
  {
    stateName: 'starWarsSource',
    namespace: 'STAR_WARS_NAMESPACE',
    delimiter: '|',
  }
})

console.log(starWarsSource.actions)
// {
//   'STAR_WARS_NAMESPACE|SHOW_CHARACTER': asyncActionCreator,
//   'STAR_WARS_NAMESPACE|SHOW_CHARACTER_PENDING': actionCreator,
//   'STAR_WARS_NAMESPACE|SHOW_CHARACTER_SUCCESS': actionCreator,
//   'STAR_WARS_NAMESPACE|SHOW_CHARACTER_ERROR': actionCreator,
//   ...
// }

console.log(starWarsSource.initialState)
// {
//   starWarsSource: {
//     data: {},
//     isPending: false,
//     errors: [],
//   }
// }
```

How to connect react component:

```js
import connectSource from 'redux-source/lib/connectSource';
import { starWarsSource } from '../ducks/starWars';

@connectSource(starWarsSource, {
  slice: state => state.sliceStateName,
  actionsProp: 'actions',
})
export default class StarWarsInfo extends PureComponent {
```

How to use the above output with [redux-cube](https://github.com/dexteryy/Project-WebCube/blob/master/packages/redux-cube):

See [react-redux-restapi-app/](https://github.com/dexteryy/Project-WebCube/tree/master/examples/webcube-initial-structure/app/react-redux-restapi-app/)
