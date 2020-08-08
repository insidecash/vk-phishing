import { join } from "path";
import { parse } from "yaml";
import { readFileSync, existsSync } from "fs";
import { EventEmitter } from "events";

export const configPath = join(process.cwd(), "config.yml");
export const pluginsDirectory = join(process.cwd(), "plugins");
export const config = parse(readFileSync(configPath, "utf8"));
export const EventsPipe = new EventEmitter();

for (const pluginName in config.plugins || {}) {
  const pluginBasePath = join(pluginsDirectory, pluginName);

  if (
    !(
      existsSync(`${pluginBasePath}.js`) ||
      existsSync(`${pluginBasePath}/index.js`)
    )
  ) {
    throw new Error(`Plugin "${pluginName}" does not exists`);
  }

  const { init } = require(pluginBasePath);
  const pluginConfig = config.plugins[pluginName];

  init(pluginConfig, EventsPipe);
}

EventsPipe.emit("system:startup");
