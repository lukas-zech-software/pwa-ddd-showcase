const path                               = require("path");
const webpack                            = require("webpack");
const HtmlWebpackPlugin                  = require("html-webpack-plugin");
const MomentLocalesPlugin                = require("moment-locales-webpack-plugin");

const babelLoader = {
  loader:  "babel-loader",
  options: {
    cacheDirectory: true,
    babelrc:        false,
    presets:        [
      [
        "@babel/preset-env",
        {
          targets: { browsers: "last 2 versions" },
          modules: false
        }
      ],
      ["@babel/preset-typescript"],
      "@babel/preset-react"
    ],
    plugins:        [
      "react-hot-loader/babel",
      "@babel/plugin-syntax-dynamic-import",
      "@babel/plugin-proposal-object-rest-spread",
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      ["@babel/plugin-proposal-class-properties", { loose: true }]
    ]
  }
};

module.exports = {
  webpack: {
    entry:   {
      vendor: [
        // Required to support async/await
        "@babel/polyfill"
      ],
      main:   [
        "react-hot-loader/patch",
        "./client/index.tsx"
      ]
    },
    output:  {
      path:          path.join(__dirname, "build/client"),
      filename:      `[name].[hash].bundle.js`,
      chunkFilename: "[name].[hash].bundle.js",
      publicPath:    "/"
    },
    devtool: false,
    resolve: {
      alias:      { "react-dom": "@hot-loader/react-dom" },
      extensions: [".ts", ".tsx", ".js"],
      modules:    [
        path.resolve(__dirname, "node_modules"),
        path.resolve(__dirname, "..", "node_modules"),
        path.resolve(__dirname, "..", "common")
      ],
      symlinks:   true
    },
    module:  {
      rules: [
        {
          test:    /\.tsx?$/,
          exclude: /node_modules/,
          use:     babelLoader
        },
        {
          test: /\.css$/,
          use:  ["style-loader", "css-loader"]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
                              title:    "Dev-my-old-startups-domain Dashboard",
                              template: path.resolve(__dirname, "client/index.html")
                            }),
      new webpack.NormalModuleReplacementPlugin(
        /google-libphonenumber/,
        path.resolve(__dirname, "../common/google-libphonenumber.shim.js")
      ),
      // Strip out all locales aside from 'en' and 'de'
      new MomentLocalesPlugin({
                                // Plugin includes `en` in locales to keep by default
                                localesToKeep: ["de"]
                              })
    ]
  }
};
