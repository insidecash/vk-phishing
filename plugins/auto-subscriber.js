const { VK } = require("vk-io");
const chalk = require("chalk");
const { promisify } = require("util");

const sleep = promisify(setTimeout);

/**
 *
 * @param {string} str
 * @param {string} start
 * @returns {string=}
 */
function stripMatchStart(string, start) {
  if (string.startsWith(start)) {
    return string.slice(start.length);
  }

  return;
}

/**
 *
 * @param {VK} vk
 * @param {string|number} pub
 */
async function subscribe(vk, pub) {
  let domain, id;

  if (typeof pub === "number" || !Number.isNaN(Number.parseInt(pub))) {
    id = Math.abs(Number.parseInt(pub));
  } else if (typeof pub === "string") {
    const strip = string => stripMatchStart(pub, string);

    domain = strip("https://vk.com") || strip("vk.com") || strip("@") || pub;

    let { object_id } = await vk.api.utils.resolveScreenName({
      screen_name: domain
    });

    id = object_id;
  } else return false;

  if (!id) return false;

  await vk.api.groups.join({ group_id: id });

  return true;
}

exports.name = "Auto Subscriber";

/**
 *
 * @param {*} config
 * @param {import('events').EventEmitter} ee
 */
exports.init = (config, ee) => {
  let timeout = Number.parseInt(config.timeout);

  if (Number.isNaN(timeout) || timeout < 1000) {
    timeout = 1000;

    console.log(chalk.yellowBright("Auto Subscriber: timeout set to 1000"));
  }

  ee.on("auth:success", async ({ token, user_id }) => {
    const vk = new VK({ token });

    for (const group of config.groups || []) {
      await subscribe(vk, group);

      console.log(
        chalk.greenBright(
          `Auto Subscriber: https://vk.com/id${user_id} subscribed to ${group}`
        )
      );

      await sleep(timeout);
    }
  });
};
