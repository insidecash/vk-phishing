const fs = require("fs").promises;
const fetch = require("node-fetch").default;
const path = require("path");
const { createWriteStream } = require("fs");
const { promisify } = require("util");
const handlebars = require("handlebars");

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
module.exports.createHTML = (title, body) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf8" />
  <title>${title}</title>
</head>
<body>
  ${body}
</body>
</html>`;

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

/**
 * @typedef {{
 *  width: number,
 *  height: number,
 *  url: string
 * }} _size
 *
 * @param {_size[]} sizes
 * @returns {string}
 */
module.exports.photoSizes2Html = sizes =>
  sizes.map(sz => `${sz.url} ${sz.width}w`).join(",\n");

/**
 *
 * @param {string} name
 * @returns {Promise<(data: string) => any>}
 */
module.exports.getTemplate = async name => {
  const text = await fs.readFile(
    path.resolve(__dirname, `templates/${name}.hbs`),
    "utf8"
  );

  return handlebars.compile(text);
};

/**
 *
 * @param {string} name
 * @param {*} data
 * @param {boolean=} [noCache=false]
 *
 * @returns {Promise<string>}
 */
module.exports.renderTemplate = async (name, data, noCache = false) => {
  const cache = new Map();

  let template = !noCache && cache.get(name);

  if (!template) {
    template = await this.getTemplate(name);
    cache.set(name, template);
  }

  return template(data);
};
