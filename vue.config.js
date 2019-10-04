const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const PreloadWebpackPlugin = require('preload-webpack-plugin');

module.exports = {
  configureWebpack: {
    plugins: [new MomentLocalesPlugin(), new PreloadWebpackPlugin()]
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "~@/assets/main.scss"`
      }
    }
  }
};
