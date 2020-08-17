import { join } from "path";
import { parse } from "yaml";
import { readFileSync } from "fs";
import { EventEmitter } from "events";
import chalk from "chalk";

export const configPath = join(process.cwd(), "config.yml");
export const pluginsDirectory = join(process.cwd(), "plugins");
export const config = parse(readFileSync(configPath, "utf8"));
export const EventsPipe = new EventEmitter();

for (const pluginName in config.plugins || {}) {
  const pluginBasePath = join(pluginsDirectory, pluginName);

  /**
   * @typedef {{
   *  init: (config: *, ee: EventEmitter) => void,
   *  name: string | undefined
   * }} Plugin
   */

  /**
   * @type {Plugin}
   */
  const plugin = require(pluginBasePath);
  const pluginConfig = config.plugins[pluginName];

  const pluginFriendlyName =
    typeof plugin.name === "string" ? plugin.name : pluginName;

  if (
    pluginConfig === false ||
    (typeof pluginConfig === "object" &&
      "enabled" in pluginConfig &&
      pluginConfig.enabled === false)
  ) {
    console.log(
      chalk.yellowBright(
        `Plugin ${chalk.bold(
          pluginFriendlyName
        )} was not initialized, because it's disabled by config`
      )
    );
  } else {
    plugin.init(pluginConfig, EventsPipe);
    console.log(
      chalk.greenBright(
        `Plugin ${pluginFriendlyName} was successful initialized`
      )
    );
  }
}

EventsPipe.emit("system:startup");
