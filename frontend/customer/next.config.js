// next.config.js
const path               = require("path");
const withPWA            = require("next-pwa");
const webpack            = require("webpack");
const runtimeCache       = require("./workbox-cache");
const TerserPlugin       = require("terser-webpack-plugin");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
                                                              enabled: process.env.ANALYZE === "true"
                                                            });

const nextConfig = {
  experimental: {
    polyfillsOptimization: true,
    hasReactRefresh: false
  },

  target: "server",
  webpack(config, options) {

    config.resolve.modules = ([
        path.resolve(__dirname, "node_modules"),
        path.resolve(__dirname, "..", "node_modules")
      ]
    );


    if (options.isServer) {
      config.externals = ["react", "react-dom", ...config.externals];
    }

    config.resolve.alias = Object.assign({}, config.resolve.alias, {
      react:        "preact/compat",
      react$:       "preact/compat",
      "react-dom":  "preact/compat",
      "react-dom$": "preact/compat"
    });

    // inject Preact DevTools
    if (options.dev && !options.isServer) {
      const entry  = config.entry;
      config.entry = () => entry()
        .then(entries => {
          entries["main.js"] = ["preact/debug"].concat(entries["main.js"] || []);
          return entries;
        });
    }

    config.module.rules.forEach((rule) => {
      if (rule.test) {
        const ruleContainsTs = rule.test.toString()
          .includes("tsx|ts");
        if (ruleContainsTs && rule.use && (rule.use.loader||rule.use[1].loader) === "next-babel-loader") {
          rule.include = undefined;
        }
      }
    });

    config.module.rules.push({
                               test: /\.mjs$/,
                               type: "javascript/auto"
                             });

    config.module.rules.push({
                               test: /\.css$/,
                               use:  ["to-string-loader", "css-loader"]
                             });

    config.plugins.push(
      new webpack.DefinePlugin({
                                 "process.env": {
                                   IS_STAGING:  JSON.stringify(process.env.IS_STAGING),
                                   NODE_ENV:    JSON.stringify(options.dev ? "develop" : "production"),
                                   API_URL:     JSON.stringify(options.dev ? "http://localhost:8380" : "https://api-customer" + process.env.BASE_DOMAIN),
                                   MAPS_KEY:     JSON.stringify(options.dev ? "some-key-dev" : "some-key"),
                                   BASE_DOMAIN: JSON.stringify(process.env.BASE_DOMAIN)
                                 }
                               }));


    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /google-libphonenumber/,
        path.resolve(__dirname, "../common/google-libphonenumber.shim.js")
      )
    );

    /* Enable only in Production */
    if (!options.dev) {
      // sourcemaps in production
      config.devtool = "source-map";

      for (const r of config.module.rules) {
        if (r.loader === "babel-loader" || r.loader === "next-babel-loader") {
          r.options.sourceMaps = true;
        }
      }

      for (const plugin of config.plugins) {
        if (plugin.constructor.name === "UglifyJsPlugin") {
          plugin.options.sourceMap = true;
          break;
        }
      }

      config.optimization.minimizer = [
        new TerserPlugin({
                           parallel:  true,
                           sourceMap: true
                         })
      ];

    }

    return config;
  }
};

const pwa        = {
  disable:               !process.env['PROD_BUILD'],
  register:              true,
  cleanupOutdatedCaches: true,
  dest:                  "public",
  sw:                    "service-worker.js",
  exclude:               [
    "/\.js\.map/",
    ({ asset, compilation }) => {
      if (asset.name.match(/^(build-manifest\.json|react-loadable-manifest\.json)$/)) {
        return true;
      }
      return false;
    }
  ],
  runtimeCaching:        runtimeCache,
};

module.exports = withBundleAnalyzer(withPWA({
                                              ...nextConfig,
                                              pwa
                                            }));

