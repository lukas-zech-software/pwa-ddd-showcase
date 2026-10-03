const moduleAlias = require("module-alias");

moduleAlias.addAlias("react", "preact/compat");
moduleAlias.addAlias("react-dom", "preact/compat");
moduleAlias.addAlias("react-ssr-prepass", "preact-ssr-prepass");

require("next/dist/bin/next");
