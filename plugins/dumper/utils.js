const fs = require("fs").promises;
const fetch = require("node-fetch").default;
const { createWriteStream, readFileSync } = require("fs");
const { promisify } = require("util");

/**
 *
 * @param {string} path
 */
module.exports.mkdir = path =>
  fs
    .opendir(path)
    .then(directory => directory.close())
    .catch(() => fs.mkdir(path, { recursive: true }));

/**
 *
 * @param {string} path
 * @param {string} text
 */
module.exports.writeFile = (path, text) => fs.writeFile(path, text, "utf8");

/**
 *
 * @param {string} name
 */
module.exports.getCss = name =>
  readFileSync(`${__dirname}/${name}.css`, "utf-8");

/**
 *
 * @param {string} path
 * @param {*} data
 */
module.exports.writeJSON = (path, data) =>
  module.exports.writeFile(path, JSON.stringify(data, undefined, 2));

/**
 *
 * @param {string} from
 * @param {string} to
 */
module.exports.download = async function download(from, to) {
  const { body } = await fetch(from);
  const writer = createWriteStream(to);

  body.pipe(writer);

  await new Promise((resolve, reject) => {
    body.on("end", resolve);
    body.on("error", reject);
  });
};

/**
 * @template T
 * @param {T[]} array
 * @param {number} groupBy
 * @returns {T[][]}
 */
function chunk(array, groupBy) {
  /** @type {T[][]} */
  const result = [];

  for (let i = 0; i < array.length; i += groupBy) {
    result.push(array.slice(i, i + groupBy));
  }

  return result;
}

/**
 * @template T
 * @template X
 * @param {(arg: T) => Promise<X>} fn
 * @param {T[]} data
 * @param {number} [maxParallel=5]
 * @returns {Promise<X[]>}
 */
module.exports.parallel = async function parallel(fn, data, maxParallel = 5) {
  /** @type {X[]} */
  const result = [];

  for (const bunch of chunk(data, maxParallel)) {
    const tasks = bunch.map(value => fn(value));

    const results = await Promise.all(tasks);

    result.push(...results);
  }

  return result;
};

module.exports.sleep = promisify(setTimeout);

/**
 *
 * @param {string} title
 * @param {string} body
 * @param {string} style
 */
module.exports.createHTML = function createHTML(title, body, style = "") {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf8" />
  <title>${title}</title>
  
  <style>${style}</style>
</head>
<body>
  ${body}
</body>
</html>`;
};

/**
 * @typedef {{
 *  width: number,
 *  height: number,
 *  url: string
 * }} _size
 *
 * @param {_size[]} sizes
 * @returns {_size}
 */
module.exports.findBiggestSize = sizes =>
  // eslint-disable-next-line unicorn/no-reduce
  sizes.reduce((sz1, sz2) =>
    sz1.width * sz1.height > sz2.width * sz2.height ? sz1 : sz2
  );
