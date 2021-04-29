const path = require('path');
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const VuetifyLoaderPlugin = require("vuetify-loader/lib/plugin");
const WebpackPwaManifest = require('webpack-pwa-manifest')
process.env.VUE_APP_BUILD_DATE = new Date().toISOString();

module.exports = {
  chainWebpack: (config) => {
    config.plugin("VuetifyLoaderPlugin").tap((args) => {
      return [
        {
          match(originalTag, { kebabTag, camelTag, path, component }) {
            if (kebabTag.startsWith("hive-")) {
              return [
                camelTag,
                `import ${camelTag} from '@/components/${camelTag.substring(
                  4
                )}.vue'`,
              ];
            }
          },
        },
      ];
    });
  },

  configureWebpack: {
    plugins: [
      new MomentLocalesPlugin(),
      new WebpackPwaManifest({
        name: "Hive Stats and Leaderboards",
        short_name: "Hive Stats",
        description:
          "Hive Stats, Leaderboards, Maps, Team changes and many things more!",
        start_url: "/",
        display: "standalone",
        theme_color: "#4285f4",
        background_color: "#4285f4",
        icons: [
          {
            src: path.resolve("src/assets/icon.png"),
            sizes: [96, 128, 192, 256, 384, 512, 1024],
          },
        ],
      }),
    ],
  },

  css: {
    loaderOptions: {
      sass: {
        data: `@import "~@/assets/main.scss"`,
      },
    },
  },

  pwa: {
    workboxOptions: {
      skipWaiting: true,
      navigateFallback: "/",
      navigateFallbackBlacklist: [/api/],
      exclude: [/api/],
      runtimeCaching: [
        {
          urlPattern: /api/,
          handler: "networkFirst",
          options: {
            networkTimeoutSeconds: 10,
            cacheName: "hive-api-cache",
            cacheableResponse: {
              statuses: [0, 200, 404],
            },
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24,
              purgeOnQuotaError: true,
            },
          },
        },
        {
          urlPattern: new RegExp("^https://crafatar.com/"),
          handler: "staleWhileRevalidate",
          options: {
            cacheableResponse: {
              statuses: [0, 200],
            },
            cacheName: "cravatar-cache",
            expiration: {
              maxEntries: 1000,
              maxAgeSeconds: 60 * 60 * 24 * 30,
              purgeOnQuotaError: true,
            },
          },
        },
        {
          urlPattern: new RegExp("^https://api.lergin.de/"),
          handler: "networkFirst",
          options: {
            networkTimeoutSeconds: 10,
            cacheName: "lergin-api-cache",
            cacheableResponse: {
              statuses: [0, 200],
            },
            expiration: {
              maxEntries: 25,
              maxAgeSeconds: 60 * 60 * 24,
              purgeOnQuotaError: true,
            },
          },
        },
      ],
    },
  },

  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: ["/"],
      useRenderEvent: true,
      headless: true,
      onlyProduction: true,
    },
  },
};
