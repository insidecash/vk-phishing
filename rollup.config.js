import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import svelte from "rollup-plugin-svelte";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import config from "sapper/config/rollup.js";
import package_ from "./package.json";
import autoPreprocess from "svelte-preprocess";

const mode = process.env.NODE_ENV;
const development = mode === "development";
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) =>
  (warning.code === "CIRCULAR_DEPENDENCY" &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  onwarn(warning);

export default {
  client: {
    input: config.client.input().replace(/\.js$/, ".ts"),
    output: config.client.output(),
    plugins: [
      replace({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode)
      }),
      svelte({
        dev: development,
        hydratable: true,
        emitCss: true,
        preprocess: autoPreprocess()
      }),
      resolve({
        browser: true,
        dedupe: ["svelte"]
      }),
      json(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),

      legacy &&
        babel({
          extensions: [".js", ".mjs", ".html", ".svelte"],
          babelHelpers: "runtime",
          exclude: ["node_modules/@babel/**"],
          presets: [
            [
              "@babel/preset-env",
              {
                targets: "> 0.25%, not dead"
              }
            ]
          ],
          plugins: [
            "@babel/plugin-syntax-dynamic-import",
            [
              "@babel/plugin-transform-runtime",
              {
                useESModules: true
              }
            ]
          ]
        }),
      // typescript({ sourceMap: development, tsconfig: "./tsconfig.json" }),

      !development &&
        terser({
          module: true
        })
    ],

    preserveEntrySignatures: false,
    onwarn
  },

  server: {
    input: config.server.input().server.replace(/\.js$/, ".ts"),
    output: config.server.output(),
    plugins: [
      replace({
        "process.browser": false,
        "process.env.NODE_ENV": JSON.stringify(mode)
      }),
      svelte({
        generate: "ssr",
        dev: development,
        preprocess: autoPreprocess()
      }),
      resolve({
        dedupe: ["svelte"]
      }),
      json(),
      typescript({ tsconfig: "./tsconfig.json" }),
      commonjs()
    ],
    external: Object.keys(package_.dependencies).concat(
      require("module").builtinModules
    ),

    preserveEntrySignatures: "strict",
    onwarn
  },

  serviceworker: {
    input: config.serviceworker.input().replace(/\.js$/, ".ts"),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode)
      }),
      json(),
      typescript({ tsconfig: "./tsconfig.json" }),
      commonjs(),
      !development && terser()
    ],

    preserveEntrySignatures: false,
    onwarn
  }
};
