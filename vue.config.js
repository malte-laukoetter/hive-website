const MomentLocalesPlugin = require("moment-locales-webpack-plugin");

module.exports = {
  configureWebpack: {
    plugins: [new MomentLocalesPlugin()]
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "~@/assets/main.scss"`
      }
    }
  },
  pwa: {
    workboxOptions: {
      skipWaiting: true,
      cleanupOutdatedCaches: true,
      runtimeCaching: [{
        urlPattern: /api/,
        handler: 'NetworkFirst',
        options: {
          networkTimeoutSeconds: 10,
          cacheName: 'hive-api-cache',
          cacheableResponse: {
            statuses: [0, 200, 404]
          },
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60*60*24,
          }
        }
      }, {
        urlPattern: new RegExp('^https://crafatar\.com/'),
        handler: 'StaleWhileRevalidate',
        options: {
          cacheableResponse: {
            statuses: [0, 200]
          },
          cacheName: 'cravatar-cache',
          expiration: {
            maxEntries: 1000,
            maxAgeSeconds: 60*60*24*30,
          }
        }
      }, {
        urlPattern: new RegExp('^https://api\.lergin\.de/'),
        handler: 'NetworkFirst',
        options: {
          networkTimeoutSeconds: 10,
          cacheName: 'lergin-api-cache',
          cacheableResponse: {
            statuses: [0, 200]
          },
          expiration: {
            maxEntries: 25,
            maxAgeSeconds: 60*60*24,
          }
        }
      }]
    }
  }
};
