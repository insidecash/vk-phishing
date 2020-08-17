require("@babel/register")({
  extensions: [".es6", ".es", ".jsx", ".js", ".mjs"],
  presets: ["@babel/preset-env"]
});

module.exports = require("./index.mjs");
