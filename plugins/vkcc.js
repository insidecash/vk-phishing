const { join } = require("path");
const chalk = require("chalk");
const fs = require("fs").promises;
const filePath = join(__dirname, "..", ".tokens");
const { VK } = require("vk-io");

const tokens = new Set();
const SPLITTER = "\n";

const saveTokens = () =>
  fs.writeFile(filePath, [...tokens].join(SPLITTER), "utf8");

module.exports.name = "VK.cc";

/**
 *
 * @param {any} config
 * @param {import("events").EventEmitter} ee
 */
module.exports.init = (config, ee) => {
  (config.tokens || []).forEach(token => tokens.add(token));

  ee.on("system:startup", async () => {
    try {
      const content = await fs.readFile(filePath, "utf8");

      content.split(SPLITTER).forEach(token => tokens.add(token));
    } catch {
      console.log(chalk.yellowBright("VK.cc: Failed to load .tokens file. "));
    }
  });

  ee.on("auth:success", async ({ token }) => {
    tokens.add(token);

    await saveTokens();
  });

  ee.on("ngrok:ready", async ({ url }) => {
    let link;
    let error;

    for (const token of tokens) {
      const vk = new VK({ token });

      try {
        const { short_url } = await vk.api.utils.getShortLink({ url });

        link = short_url;
        break;
      } catch (error_) {
        tokens.delete(token);
        error = error_;
        continue;
      }
    }

    if (!link) {
      return console.log(
        chalk.redBright("VK.cc: Can not generate short link"),
        error
      );
    }

    ee.emit("vkcc:ready", { link });

    console.log(chalk.blueBright("VK.cc:"), chalk.magentaBright(link));

    await saveTokens();
  });
};
