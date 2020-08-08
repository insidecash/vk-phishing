const { connect } = require("ngrok");
const chalk = require("chalk");

/**
 *
 * @param {any} config
 * @param {import("events").EventEmitter} ee
 */
module.exports.init = (config, ee) => {
  if (config.enabled === false) {
    return console.log(
      chalk.yellowBright(
        "NGrok plugin does not loaded, because its disabled by plugin settings"
      )
    );
  } else {
    console.log(chalk.greenBright("NGrok enabled"));
  }

  ee.on("server:startup", async ({ port }) => {
    const ngrokUrl = await connect({
      ...config,
      addr: port,
      onStatusChange: status => {
        if (status === "connected") {
          ee.emit("ngrok:connected");

          console.log(chalk.bold("NGrok:"), chalk.greenBright("CONNECTED"));
        } else {
          ee.emit("ngrok:closed");

          console.log(chalk.bold("NGrok:"), chalk.redBright("DISCONNECTED"));
        }
      }
    });

    ee.emit("ngrok:ready", ngrokUrl);

    console.log(chalk.bold(`NGrok URL:`), chalk.magentaBright(ngrokUrl));
  });
};
