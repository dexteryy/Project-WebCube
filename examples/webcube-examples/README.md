
[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

More Examples:

* [webcube-todo-app](../webcube-todo-app)

## Source code

* [./app/react-sample](./app/react-sample)
* [./app/redux-cube-sample](./app/redux-cube-sample)
* [./app/redux-source-sample](./app/redux-source-sample)
* [./app/rough-sample](./app/rough-sample)


## Setup

```bash
cd ../../ # go to the root directory
npm run setup
```

## Develeopment

```bash
npm run dev
# HMR
```

or

```bash
npm run build
npm run serve
# SSR or static web
```

View:

* http://localhost:8011/react-sample/
* http://localhost:8011/redux-cube-sample/
* http://localhost:8011/redux-source-sample/
* http://localhost:8011/rough-sample/

Clean cache:

```bash
npm run clean
```

or

```bash
npm run build -- -c
```

## Deployment

```bash
NODE_ENV=production DEPLOY_ENV={{delopy_env}} npm run build -- -c
NODE_ENV=production DEPLOY_ENV={{delopy_env}} ACCESS_KEY_ID={{key}} ACCESS_KEY_SECRET={{scecret}} MONOREPO_PACKAGES_PATH=packages ENABLE_CHINA_MIRROR=true REGISTRY_URL="{{registry}}/{{namespace}}/{{image}}:{{tag}}" npm run deploy
```



