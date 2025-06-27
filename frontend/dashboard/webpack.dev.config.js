const path    = require("path");
const merge   = require("webpack-merge");
const common  = require("./webpack.common.config.js");
const webpack = require("webpack");
const ForkTsCheckerWebpackPlugin         = require("fork-ts-checker-webpack-plugin");
const ForkTsCheckerNotifierWebpackPlugin = require("fork-ts-checker-notifier-webpack-plugin");

module.exports = merge(common.webpack, {
  mode:      "development",
  devtool:   "cheap-module-eval-source-map",
  watchOptions: {
     poll: 1000,
     ignored: ["node_modules"]
},
  devServer: {
    contentBase:        [
      path.join(__dirname, "build/client"),
      path.join(__dirname, "static")
    ],
    hot:                true,
    historyApiFallback: true,        //Live-reload
    port:               8181,        //Port Number
    host:               "localhost",  //Change to '0.0.0.0' for external facing server
    inline:             true,
    headers:            {
      "Access-Control-Allow-Origin":  "*",
      "Access-Control-Allow-Headers": "*"
    }

  },

  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new ForkTsCheckerNotifierWebpackPlugin({
                                             excludeWarnings: true,
                                             skipSuccessful:  true
                                           }),

    // set global variables on the client
    new webpack.DefinePlugin({
                               "process.env": {
                                 IS_STAGING: JSON.stringify("true"),
                                 NODE_ENV:   JSON.stringify("develop"),
                                 API_URL:    JSON.stringify("http://localhost:8180"),
                                 MAPS_KEY:   JSON.stringify("AIzaSyB3vX4YdtnhnjIHTbqVWpJW0G6_zXdkn28")

                               }
                             })]

});
