const merge                              = require("webpack-merge");
const common                             = require("./webpack.common.config.js");
const webpack                            = require("webpack");
const path                               = require("path");
const ForkTsCheckerNotifierWebpackPlugin = require("fork-ts-checker-notifier-webpack-plugin");
const ForkTsCheckerWebpackPlugin         = require("fork-ts-checker-webpack-plugin");

module.exports = merge(common.webpack, {
  mode:      "development",
  devtool:   "cheap-module-eval-source-map",
  devServer: {
    contentBase:        "./build/client",
    hot:                true,
    historyApiFallback: true,        //Live-reload
    port:               8282,        //Port Number
    host:               "localhost",  //Change to '0.0.0.0' for external facing server
    inline:             true,
    headers:            {
      "Access-Control-Allow-Origin":  "*",
      "Access-Control-Allow-Headers": "*"
    }

  },
  module:    {
    rules: [
      {
        test:    /\.ts(x?)$/,
        use:     [common.babelLoader],
        exclude: path.resolve(__dirname, "node_modules/")
      }
    ]
  },

  plugins: [
    new ForkTsCheckerNotifierWebpackPlugin({
                                             excludeWarnings: true,
                                             skipSuccessful:  true
                                           }),
    // set global variables on the client
    new webpack.DefinePlugin({
                               "process.env": {
                                 NODE_ENV:      JSON.stringify("develop"),
                                 API_URL:       JSON.stringify("http://localhost:8280"),
                                 DASHBOARD_URL: JSON.stringify("http://localhost:8181")
                               }
                             })
  ]

});
