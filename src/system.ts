import { resolve as pathResolve } from "path";
import { parse } from "yaml";
import { readFileSync, existsSync } from "fs";
import { EventEmitter } from "events";
import chalk from "chalk";
import arg from "arg";
import { handle, write } from "./ipc";

const parameters = arg({
  "--config-path": String,
  "--plugins-path": String,
  "--static-path": String,
  "--embed": Boolean
});

export const configPath =
  parameters["--config-path"] ?? pathResolve(process.cwd(), "config.yml");
export const pluginsDirectory =
  parameters["--plugins-path"] ?? pathResolve(process.cwd(), "plugins");

export const staticPath =
  parameters["--static-path"] ?? pathResolve(process.cwd(), "static");

const actualConfig = existsSync(configPath)
  ? parse(readFileSync(configPath, "utf8"))
  : {
      plugins: (() => {
        console.log(
          chalk.redBright(
            `Unable to read config file because id does not exists at ${configPath}`
          )
        );

        return {};
      })()
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
export const EventsPipe = new (class EventsPipeClass extends EventEmitter {
  constructor() {
    super();

    if (parameters["--embed"]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handle(process.stdin, ({ event, args }: any) => {
        super.emit(event, ...args);
      });
    }
  }

  emit(event: string | symbol, ...arguments_: unknown[]) {
    if (parameters["--embed"]) {
      write(process.stdout, { event: String(event), args: arguments_ });
    }

    return super.emit(event, ...arguments_);
  }
})();

(() => {
  if (!existsSync(pluginsDirectory) || process.env.SAPPER_EXPORT) {
    console.log(
      chalk.redBright(
        `Unable to load plugins because plugins dir (${pluginsDirectory}) does not exists`
      )
    );

    return;
  }
  for (const pluginName in config.plugins || {}) {
    const pluginBasePath = pathResolve(pluginsDirectory, pluginName);

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
