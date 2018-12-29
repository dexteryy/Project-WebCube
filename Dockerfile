
FROM node:10.15

ARG NODE_ENV=development
ARG MONOREPO_APP_PATH
ARG MONOREPO_PACKAGES_PATH
ARG ENABLE_CHINA_MIRROR
ARG PORT=80

ENV NODE_ENV ${NODE_ENV}
ENV PORT ${PORT}

# # for unbuntu
# RUN echo "Asia/Shanghai" > /etc/timezone
# RUN dpkg-reconfigure -f noninteractive tzdata

WORKDIR /usr/src/app
COPY package.json yarn.lock .yarnrc lerna.json ./
COPY ${MONOREPO_APP_PATH}/package.json ${MONOREPO_APP_PATH}/
COPY ${MONOREPO_PACKAGES_PATH} ${MONOREPO_PACKAGES_PATH}/

RUN set -ex; \
    if [ "$ENABLE_CHINA_MIRROR" = "true" ]; then \
        npm set registry https://registry.npm.taobao.org; \
        npm set disturl https://npm.taobao.org/dist; \
        npm set sass_binary_site https://npm.taobao.org/mirrors/node-sass; \
        npm set electron_mirror https://npm.taobao.org/mirrors/electron/; \
        npm set puppeteer_download_host https://npm.taobao.org/mirrors; \
        npm set chromedriver_cdnurl https://npm.taobao.org/mirrors/chromedriver; \
        npm set phantomjs_cdnurl https://npm.taobao.org/mirrors/phantomjs; \
        npm set selenium_cdnurl https://npm.taobao.org/mirrors/selenium; \
        npm set node_inspector_cdnurl https://npm.taobao.org/mirrors/node-inspector; \
        yarn config set registry https://registry.npm.taobao.org; \
    fi;

RUN yarn install --no-cache --pure-lockfile

COPY . .

WORKDIR /usr/src/app/${MONOREPO_APP_PATH}

EXPOSE ${PORT}
CMD ["npm", "run", "serve"]
