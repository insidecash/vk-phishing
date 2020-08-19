import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import { dependencies } from "./package.json";
import { builtinModules } from "module";
import { removeSync } from "fs-extra";

removeSync("lib");

export default {
  input: "./src/exports.ts",
  output: [
    {
      file: "./lib/exports.js",
      format: "commonjs",
      exports: "named"
    },
    {
      file: "./lib/exports.mjs",
      format: "module"
    }
  ],
  plugins: [
    resolve(),
    json(),
    typescript({
      tsconfig: "./tsconfig.json"
    })
  ],
  external: [...Object.keys(dependencies), ...builtinModules]
};
