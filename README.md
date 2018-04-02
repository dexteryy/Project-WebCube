
# Project WebCube (monorepo)

Continuously updated JS infrastructure for [modern web dev](https://github.com/dexteryy/spellbook-of-modern-webdev)

> NOTE: This repo itself is also a template or starter for [Universal JS monorepo](https://gist.github.com/dexteryy/1618d2398e0b24ee250535b7bc358342)

## Packages

* [webcube](./packages/webcube/) - Continuously updated JS infrastructure for modern Universal JS web app/site and static web.
    * [eslint-config-webcube](./packages/eslint-config-webcube/) - A sharable ESLint presets which integrates Prettier and explicitly configures all-available rules (guaranteed by scripts) from ESLint core and commonly used plugins.
* [react-with-scripts](./packages/react-with-scripts/) - Add third party script tags, JS SDK and tracking code without modifying any HTML code
* [react-common-kit](./packages/react-common-kit/) - Wrappers for some common used react components and utilities
* [redux-cube](./packages/redux-cube/) - App state manager. A set of wrappers which simplify the use of Redux and its whole ecosystem, reduce boilerplate, and provide many features (Sub App, Reducer Bundle, ...)
    * [redux-cube-with-router](./packages/redux-cube-with-router/) - redux-cube's pluggable module for react-router v4+
    * [redux-cube-with-router-legacy](./packages/redux-cube-with-router-legacy/) - redux-cube's pluggable module for react-router v3
    * [redux-cube-with-persist](./packages/redux-cube-with-persist/) - redux-cube's pluggable module for redux-persist
    * [redux-cube-with-immutable](./packages/redux-cube-with-immutable/) - redux-cube's pluggable module for redux-immutable
* [redux-source](./packages/redux-source/) - Using GraphQL schema and query language to access any data source (eg. RESTful APIs) and automatically generate reducers, actions and normalized state
    * [redux-source-immutable](./packages/redux-source-immutable/) - The Immutable.js version of redux-source
    * [redux-source-connect](./packages/redux-source-connect/) - Connect React components to Redux states maintained by redux-source automatically
    * [redux-source-connect-immutable](./packages/redux-source-connect-immutable/) - Connect React components to Redux states maintained by redux-source-immutable automatically
    * [redux-source-with-notify](./packages/redux-source-with-notify/) - A React higher-order component for displaying notifications based on Redux states maintained by redux-source automatically
    * [redux-source-with-block-ui](./packages/redux-source-with-block-ui/) - A React higher-order component for displaying "React Block UI" based on Redux states maintained by redux-source automatically
* [hifetch](./packages/hifetch/) - A minimal higher-level wrapper around Fetch API
* [WIP] [nodecube](https://github.com/dexteryy/nodecube) - Continuously updated JS infrastructure for Node.js microservice or API gateway service.

## Starters

* [Webcube's Starter For Standalone Repo](./starters/webcube-app-as-standalone/)
* [Webcube's Starter For Project In Monorepo](./starters/webcube-app-in-monorepo/)
* [Nodecube's Starter For Standalone Repo](./starters/nodecube-service-as-standalone/)
* [Nodecube's Starter For Project In Monorepo](./starters/nodecube-service-in-monorepo/)

## Examples (in monorepo)

* [Initial Webcube Examples](./examples/webcube-initial-structure/)
* [Webcube's TodoMVC Example](./examples/webcube-todo-app/)
* [Initial Nodecube Examples](./examples/nodecube-initial-structure/)
