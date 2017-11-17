# Webcube's TodoMVC Example

[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

* Examples for usage of [redux-cube](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-cube) and [webcube's boilerplate](https://github.com/dexteryy/Project-WebCube/tree/master/packages/webcube/boilerplate)

More Examples:

* [Initial Webcube Examples](../examples/webcube-initial-structure)

## Source Code

* [./app/todo-app](./app/todo-app)
* [./app/multiple-todo-apps](./app/multiple-todo-apps)

## View Results in Production Environment

* [todo-app](https://app.cubemage.cn/todo-app/index.html)
* [multiple-todo-apps](https://app.cubemage.cn/multiple-todo-apps/index.html)

## View Results in Development Environment

Preparation

```bash
git clone git@github.com:dexteryy/Project-WebCube.git ./a-mono-repo
```

```bash
cd ./a-mono-repo
npm run update
```

```bash
cd ./examples/webcube-todo-app
cp ./configs/env.sample.config ./env.config
```

Run

```bash
npm run dev
```

or

```bash
npm run build
```

or

```bash
NODE_ENV=production npm run build
```

View

* http://localhost:8011/todo-app/
* http://localhost:8011/multiple-todo-apps/
