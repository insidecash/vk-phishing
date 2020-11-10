const chalk = require("chalk");
const _ = console.log;

const kw = (key, value) =>
  _(chalk.blueBright(`${key}:`), chalk.magentaBright(value));

const factory = (color, out = _) => (...x) => out(...x.map(y => color(y)));

const message = factory(chalk.magentaBright);

const secondaryMessage = (message, sign = "") =>
  _(chalk.magentaBright(sign), chalk.blueBright(message));

const warning = factory(chalk.yellowBright, console.warn);
const error = factory(chalk.redBright, console.error);
const success = factory(chalk.greenBright);

module.exports = { kw, message, error, success, warning, secondaryMessage };
