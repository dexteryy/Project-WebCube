# TodoMVC example for webcube

[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

More Examples:

* [webcube-exampless](../webcube-examples)

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

* http://localhost:8012/

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



