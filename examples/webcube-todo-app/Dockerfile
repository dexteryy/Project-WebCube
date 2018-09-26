
FROM node:10.9

ARG ENABLE_CHINA_MIRROR
ARG PORT=80

ENV PORT ${PORT}

# for unbuntu
RUN echo "Asia/Shanghai" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

WORKDIR /usr/src/app
COPY package.json yarn.lock .yarnrc ./

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

EXPOSE ${PORT}
CMD ["npm", "run", "serve"]
