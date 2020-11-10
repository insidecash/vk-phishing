const fs = require("fs-extra");
const { execSync } = require("child_process");

fs.removeSync("build");
fs.mkdirpSync("build");

// Very important crutch. It is here
// because rollup-plugin-typescript2
// is dumb, and cannot enable declarations
// for specific build. That because its enabled
// by default and make declaration files
// in __sapper__ dir.
execSync("rm ./__sapper__/**/*.d.ts");

execSync("npm run build:exports");

const requiredFiles = [
  "README.md",
  "LICENSE.txt",
  "config.yml",
  "plugins",
  "static"
];
const clientFiles = [
  "__sapper__",
  "package.json",
  "package-lock.json",
  "yarn.lock"
];

const buildsMap = {
  windows: ["install.bat", "start.bat", ...clientFiles, ...requiredFiles],
  unix: ["install.sh", "start.sh", ...clientFiles, ...requiredFiles],
  docker: ["docker-compose.example.yml", ...requiredFiles],
  external: ["lib", ...clientFiles, ...requiredFiles]
};

for (const build in buildsMap) {
  const buildDirectory = `build/${build}`;
  fs.mkdirpSync(buildDirectory);

  for (const file of buildsMap[build]) {
    fs.copySync(`${__dirname}/${file}`, `${buildDirectory}/${file}`);
  }
}
