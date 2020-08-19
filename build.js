const fs = require("fs-extra");

fs.removeSync("build");
fs.mkdirpSync("build");

const requiredFiles = [
  "README.md",
  "LICENSE",
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
