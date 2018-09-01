
[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

* Sample code for [webcube](https://github.com/dexteryy/Project-WebCube/tree/master/packages/webcube), [redux-cube](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-cube) and [redux-source](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-source)

More Examples:

* [webcube-todo-app](../webcube-todo-app)
* [webcube-rough-example](../webcube-rough-example)

## Source code

* [./app/react-sample](./app/react-sample)
* [./app/redux-cube-sample](./app/redux-cube-sample)
* [./app/redux-source-sample](./app/redux-source-sample)

## View results in production environment

WIP

## View results in development environment

Preparation

```bash
git clone git@github.com:dexteryy/Project-WebCube.git ./a-mono-repo
```

```bash
cd ./a-mono-repo
npm run setup
```

```bash
cd ./examples/webcube-examples
```

Run

```bash
npm run dev
```

or

```bash
npm run build && npm run serve
```

or

```bash
NODE_ENV=production npm run build && npm run serve
```

View

* http://localhost:8011/react-sample/
* http://localhost:8011/redux-cube-sample/
* http://localhost:8011/redux-source-sample/
