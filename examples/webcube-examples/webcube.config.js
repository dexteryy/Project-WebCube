module.exports = {
  css: {
    cssModules: {
      enable: true,
    },
  },
  dev: {
    port: 8011,
  },
  deploy: {
    override: {
      production: {
        staticRoot: 'https://app.cubemage.cn/static/',
        staticCloud: 'oss',
        staticCloudEndpoint: 'oss-cn-hangzhou.aliyuncs.com',
        staticCloudUrl: 'oss://yy-static-web-app',
      },
    },
    ssrServer: {
      warmUpUrls: ['/counter', '/number'],
    },
  },
};
