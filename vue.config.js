const { defineConfig } = require("@vue/cli-service");
const path = require("path");
const { VuetifyPlugin } = require("webpack-plugin-vuetify");
const webpack = require("webpack");

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new VuetifyPlugin({
        autoImport: true,
      }),
      // Vue 3 Feature Flags 정의
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: "true",
        __VUE_PROD_DEVTOOLS__: "false",
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@modules": path.resolve(__dirname, "src/modules"),
        "@shared": path.resolve(__dirname, "src/shared"),
        "@admin": path.resolve(__dirname, "src/modules/admin"),
        "@portfolio": path.resolve(__dirname, "src/modules/portfolio"),
        "@welcome": path.resolve(__dirname, "src/modules/welcome"),
      },
      modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
    },
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/shared/styles/variables.scss";`,
      },
    },
  },
  devServer: {
    port: 8080,
    client: {
      overlay: {
        warnings: false,
        errors: false,
      },
    },
    proxy: {
      "/api": {
        target: process.env.VUE_APP_API_URL || "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  chainWebpack: (config) => {
    // html-webpack-plugin 경로 문제 해결
    config.plugin("html").tap((args) => {
      return args;
    });
  },
});
