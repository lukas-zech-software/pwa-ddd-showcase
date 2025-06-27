const path                       = require("path");
const merge                      = require("webpack-merge");
const common                     = require("./webpack.common.config.js");
const webpack                    = require("webpack");
const HtmlWebpackPlugin          = require("html-webpack-plugin");
const TerserPlugin               = require("terser-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = merge(common.webpack, {
  mode: "production",

  module:       {
    rules: [
      {
        test:    /\.ts(x?)$/,
        use:     common.babelLoader,
        exclude: path.resolve(__dirname, "node_modules/")
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    },
    minimizer:   [
      new TerserPlugin({
                         parallel: true
                       })
    ]
  },

  plugins: [
    // Use 7/8 Cores on CLI
    new ForkTsCheckerWebpackPlugin({
                                     workers:                     ForkTsCheckerWebpackPlugin.ONE_CPU_FREE,
                                     useTypescriptIncrementalApi: false
                                   }),
    // set global variables on the client
    new webpack.DefinePlugin({
                               "process.env": {
                                 IS_STAGING: JSON.stringify(process.env.IS_STAGING),
                                 NODE_ENV:   JSON.stringify("production"),
                                 API_URL:    JSON.stringify("https://api-dashboard" + process.env.BASE_DOMAIN),
                                 MAPS_KEY:   JSON.stringify("AIzaSyBZDV-qnqQ8LXfQ9ZBwzbQ3yDhofEhStjQ")

                               }
                             }),
    new HtmlWebpackPlugin({
                            title:    "my-old-startups-domain Dashboard",
                            template: path.resolve(__dirname, "client/index.html")
                          })
  ]
});
