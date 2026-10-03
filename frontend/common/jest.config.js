module.exports = {
  rootDir:                ".",
  globals:                {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  globalSetup:            "./test/jest.global.setup.js",
  setupFiles:             [
    "./test/jest.setup.ts"
  ],
  clearMocks:             true,
  verbose:                false,
  testEnvironment:        "node",
  testMatch:              [
    "**/*.spec.ts",
    "**/*.test.ts"
  ],
  testPathIgnorePatterns: [
    "/mocks/",
    "/dist/"
  ],
  coverageDirectory:      "coverage",
  collectCoverage:        false,
  collectCoverageFrom:    [
    "src/**/*.ts",
    "src/**/I*.ts",
    "!**/interfaces/**",
    "!**/typings/**",
    "!**/*.d.ts"
  ],
  coverageReporters:      [
    "html",
    "text-summary"
  ],
  moduleFileExtensions:   [
    "js",
    "json",
    "ts"
  ],
  moduleDirectories:      [
    "node_modules"
  ],
  preset:                 "ts-jest"
};
