
# Project WebCube (monorepo)

Continuously updated JS infrastructure for [modern web dev](https://github.com/dexteryy/spellbook-of-modern-webdev)

> NOTE: This repo itself is also a template or starter for [Universal JS monorepo](https://gist.github.com/dexteryy/1618d2398e0b24ee250535b7bc358342)

## Table of Content

### Packages (all support monorepo)

* [webcube](./packages/webcube/) - Continuously updated JS infrastructure for modern Universal JS web app/site and static web.
* [eslint-config-webcube](./packages/eslint-config-webcube/) - A sharable ESLint presets which integrates Prettier and explicitly configures all-available rules (guaranteed by scripts) from ESLint core and commonly used plugins.
* [redux-cube](./packages/redux-cube/) - App state manager. A set of wrappers which simplify the use of Redux and its whole ecosystem, reduce boilerplate, and provide many features (Sub App, Reducer Bundle, ...)
    * [redux-cube-withrouter3](./packages/redux-cube-withrouter3/) - redux-cube's pluggable module for react-router v3
* [hifetch](./packages/hifetch/) - A minimal higher-level wrapper around Fetch API
* [nodecube](./packages/nodecube/) - Continuously updated JS infrastructure for Node.js microservice or API gateway service.

### Starters

* [webcube's starter for standalone repo](./starters/webcube-app-as-standalone/)
* [webcube's starter for project in monorepo](./starters/webcube-app-in-monorepo/)
* [nodecube's starter for standalone repo](./starters/nodecube-service-as-standalone/)
* [nodecube's starter for project in monorepo](./starters/nodecube-service-in-monorepo/)

### Examples (in monorepo)

* [webcube project's initial structure](./examples/webcube-initial-structure/)
* [webcube's TodoMVC example](./examples/webcube-todo-app/)
* [nodecube project's initial structure](./examples/nodecube-initial-structure/)
