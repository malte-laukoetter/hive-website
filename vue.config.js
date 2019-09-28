const MomentLocalesPlugin = require("moment-locales-webpack-plugin");

module.exports = {
  configureWebpack: {
    plugins: [new MomentLocalesPlugin()]
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "~@/assets/main.scss"`,
      },
    },
  },
};
