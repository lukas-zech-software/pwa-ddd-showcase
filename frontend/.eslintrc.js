const common = require("../.eslintrc");

module.exports = {
  ...common,
  "parserOptions": {
    "project":    __dirname + "/tsconfig.base.json",
    ecmaFeatures: {
      jsx: true  // Allows for the parsing of JSX
    }
  },
  settings:        {
    react: {
      version: "detect"  // Tells eslint-plugin-react to automatically detect the version of React to use
    }
  },
  "plugins":       [
    "react-hooks"
  ],
  "extends":       [
    "plugin:react/recommended"
  ],
  "rules":         {
    ...common.rules,
    // disabled, because of _Classes
    "@typescript-eslint/class-name-casing": [
      "error",
      {
        "allowUnderscorePrefix": true,
      }
    ],
    "react-hooks/rules-of-hooks":           "error",
    "react-hooks/exhaustive-deps":          "warn",
    "react/prop-types":                     "off",
    "react/jsx-indent-props":               [1, "first"],
  }
};
