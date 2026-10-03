module.exports = {
  "env":           {
    "browser": true,
    "es6":     true,
    "node":    true
  },
  "parser":        "@typescript-eslint/parser",
  "parserOptions": {
    "project":    "./tsconfig.json",
    "sourceType": "module",
    ecmaVersion:  2018
  },
  "plugins":       [
    "@typescript-eslint",
    "@typescript-eslint/tslint",
    "arca"
  ],
  "extends":       [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules":         {
    "@typescript-eslint/interface-name-prefix":         ["warn", { "prefixWithI": "always" }],
    "@typescript-eslint/adjacent-overload-signatures":  "warn",
    "@typescript-eslint/array-type":                    "warn",
    "@typescript-eslint/ban-types":                     "warn",
    "@typescript-eslint/class-name-casing":             "warn",
    "@typescript-eslint/explicit-member-accessibility": [
      "warn",
      {
        "overrides": {
          "constructors": "off"
        }
      }
    ],
    "@typescript-eslint/indent":                        [
      "warn",
      2,
      {
        VariableDeclarator:    "first",
        "FunctionDeclaration": {
          "parameters": "first"
        },
        "FunctionExpression":  {
          "parameters": "first"
        },
        "CallExpression":      {
          "arguments": "first"
        },
        SwitchCase:            1,
        ImportDeclaration:     "first",
        ArrayExpression:       "first",
        ObjectExpression:      "first",
        ignoredNodes:          [
          "JSXAttribute",
          "JSXSpreadAttribute"
        ]
      }
    ],
    "@typescript-eslint/unbound-method":                [
      "error",
      {
        "ignoreStatic": true
      }
    ],
    "require-await":                                    "off",
    "@typescript-eslint/require-await":                 "off",
    "@typescript-eslint/member-ordering":               "warn",
    "@typescript-eslint/consistent-type-assertions":    ["warn", {
      "assertionStyle": "as"
    }],
    "@typescript-eslint/consistent-type-definitions":   ["warn", "type"],
    "@typescript-eslint/no-empty-interface":            "warn",
    "@typescript-eslint/no-empty-function":             "off",
    "@typescript-eslint/no-explicit-any":               "off",
    "@typescript-eslint/no-inferrable-types":           "warn",
    "@typescript-eslint/no-misused-new":                "warn",
    "@typescript-eslint/no-namespace":                  "warn",
    "@typescript-eslint/no-parameter-properties":       "off",
    "@typescript-eslint/no-require-imports":            "off",
    "@typescript-eslint/no-use-before-declare":         "off",
    "@typescript-eslint/no-var-requires":               "off",
    "@typescript-eslint/prefer-regexp-exec":            "off",
    "@typescript-eslint/prefer-for-of":                 "warn",
    "@typescript-eslint/prefer-function-type":          "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/prefer-interface":              "off",
    "@typescript-eslint/prefer-namespace-keyword":      "off",
    "@typescript-eslint/type-annotation-spacing":       "warn",
    "@typescript-eslint/unified-signatures":            "warn",
    "arrow-body-style":                                 "warn",
    "complexity":                                       "off",
    "constructor-super":                                "warn",
    "curly":                                            "warn",
    "default-case":                                     "warn",
    "dot-notation":                                     "warn",
    "eol-last":                                         "warn",
    "guard-for-in":                                     "warn",
    "key-spacing":                                      [
      "error", {
        "align": {
          "afterColon": true,
          "on":         "value",
          "mode":       "minimum"
        }
      }
    ],
    "max-classes-per-file":                             [
      "warn",
      1
    ],
    "new-parens":                                       "warn",
    "no-bitwise":                                       "off",
    "no-caller":                                        "warn",
    "no-cond-assign":                                   "off",
    "no-console":                                       [
      "warn",
      {
        "allow": [
          "debug",
          "info",
          "time",
          "timeEnd",
          "trace"
        ]
      }
    ],
    "no-debugger":                                      "warn",
    "no-empty":                                         "off",
    "no-empty-functions":                               "off",
    "no-eval":                                          "warn",
    "no-fallthrough":                                   "off",
    "no-invalid-this":                                  "off",
    "no-multi-spaces":                                  [
      "error",
      {
        exceptions: {
          "ImportDeclaration":    true,
          "VariableDeclarator":   true,
          "AssignmentExpression": true,
          "EnumValue":            true
        }
      }
    ],
    "no-multiple-empty-lines":                          "warn",
    "no-new-wrappers":                                  "warn",
    "no-throw-literal":                                 "warn",
    "no-undef-init":                                    "warn",
    "no-unsafe-finally":                                "warn",
    "no-unused-labels":                                 "warn",
    "no-var":                                           "warn",
    "object-shorthand":                                 "warn",
    "one-var":                                          "off",
    "prefer-const":                                     "warn",
    "quote-props":                                      [
      "off"
    ],
    "radix":                                            "warn",
    "space-before-function-paren":                      [
      "warn",
      {
        "anonymous":  "never",
        "asyncArrow": "always",
        "named":      "never"
      }
    ],
    "use-isnan":                                        "warn",
    "valid-typeof":                                     "off",
    "@typescript-eslint/tslint/config":                 [
      "error",
      {
        "rules": {
          "align":                       [
            true,
            "statements",
            "arguments",
            "parameters",
            "members",
            "elements"
          ],
          "comment-format":              [
            true,
            "check-space"
          ],
          "consistent-type-definitions": ["warn", "type"],
          "import-spacing":              false,
          "jsdoc-format":                true,
          "max-line-length":             [
            true,
            120
          ],
          "no-duplicate-variable":       true,
          "no-reference-import":         true,
          "no-trailing-whitespace":      true,
          "no-unused-expression":        true,
          "one-line":                    [
            true,
            "check-open-brace",
            "check-catch",
            "check-else",
            "check-whitespace"
          ],
          "only-arrow-functions":        [
            true,
            "allow-declarations",
            "allow-named-functions"
          ],
          "ordered-imports":             [
            true,
            {
              "import-sources-order": "case-insensitive",
              "module-source-path":   "full",
              "named-imports-order":  "case-insensitive"
            }
          ],
          "quotemark":                   [
            true,
            "single",
            "jsx-double"
          ],
          "semicolon":                   true,
          "trailing-comma":              [
            true,
            {
              "multiline":  "always",
              "singleline": "never"
            }
          ],
          "triple-equals":               true,
          "typedef":                     [
            true,
            "call-signature",
            "property-declaration"
          ],
          "variable-name":               [
            true,
            "check-format",
            "allow-leading-underscore",
            "allow-pascal-case",
            "ban-keywords"
          ],
          "whitespace":                  [
            true,
            "check-branch",
            "check-decl",
            "check-operator",
            "check-separator",
            "check-type",
            "check-module"
          ]
        }
      }
    ],
    "arca/import-align":                                [1, { collapseExtraSpaces: false }]
  }
};
