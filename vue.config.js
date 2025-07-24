const path = require('path');

module.exports = {
  lintOnSave: false,
  devServer: {
    client: {
      overlay: {
        warnings: false,
        errors: false
      }
    }
  },
  configureWebpack: {
    resolve: {
      modules: [
        path.resolve(__dirname, 'node_modules'),
        'node_modules'
      ]
    }
  },
  chainWebpack: config => {
    // html-webpack-plugin 경로 문제 해결
    config.plugin('html').tap(args => {
      return args;
    });
  }
}