const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const VuetifyLoaderPlugin = require("vuetify-loader/lib/plugin");

module.exports = {
  chainWebpack: config => {
    config.plugin("VuetifyLoaderPlugin").tap(args => {
      return [
        {
          match(originalTag, { kebabTag, camelTag, path, component }) {
            if (kebabTag.startsWith("hive-")) {
              return [
                camelTag,
                `import ${camelTag} from '@/components/${camelTag.substring(
                  4
                )}.vue'`
              ];
            }
          }
        }
      ];
    });
  },
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
      navigateFallback: "/",
      navigateFallbackBlacklist: [/api/],
      runtimeCaching: [
        {
          urlPattern: /api/,
          handler: "networkFirst",
          options: {
            networkTimeoutSeconds: 10,
            cacheName: "hive-api-cache",
            cacheableResponse: {
              statuses: [0, 200, 404]
            },
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24,
              purgeOnQuotaError: true
            }
          }
        },
        {
          urlPattern: new RegExp("^https://crafatar.com/"),
          handler: "staleWhileRevalidate",
          options: {
            cacheableResponse: {
              statuses: [0, 200]
            },
            cacheName: "cravatar-cache",
            expiration: {
              maxEntries: 1000,
              maxAgeSeconds: 60 * 60 * 24 * 30,
              purgeOnQuotaError: true
            }
          }
        },
        {
          urlPattern: new RegExp("^https://api.lergin.de/"),
          handler: "networkFirst",
          options: {
            networkTimeoutSeconds: 10,
            cacheName: "lergin-api-cache",
            cacheableResponse: {
              statuses: [0, 200]
            },
            expiration: {
              maxEntries: 25,
              maxAgeSeconds: 60 * 60 * 24,
              purgeOnQuotaError: true
            }
          }
        }
      ]
    }
  }
};
