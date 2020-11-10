import { resolve } from "path";
import { spawn } from "child_process";
import type { ChildProcessWithoutNullStreams } from "child_process";

export { auth } from "./misc/auth";

export * as authConstants from "./misc/auth-constants";
export * as appsCredentials from "./misc/credentials";

const baseDirectory = resolve(__dirname, "..");

export function bootstrap(
  serverPath = resolve(baseDirectory, "__sapper__", "build", "index.js"),
  node = process.argv[0],
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  {
    configPath = resolve(baseDirectory, "config.yml"),
    pluginsPath = resolve(baseDirectory, "plugins"),
    staticPath = resolve(baseDirectory, "static"),
    cwd = baseDirectory,
    argv0 = process.argv0,
    // eslint-disable-next-line unicorn/prevent-abbreviations
    env = process.env
  }
): ChildProcessWithoutNullStreams {
  return spawn(
    `${node} ${serverPath} --config-path ${configPath} --plugins-path ${pluginsPath} --static-path ${staticPath} --embed`,
    {
      env,
      cwd,
      argv0
    }
  );
}

export * as ipc from "./ipc";
