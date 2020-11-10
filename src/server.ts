import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import { json } from "body-parser";
import * as sapper from "@sapper/server";
import chalk from "chalk";
import { config, EventsPipe, staticPath } from "./system";
import { existsSync } from "fs";
import { execSync } from "child_process";

const port = config.port || 3000;
process.env.PORT = port;

const development = process.env.NODE_ENV === "development";

const app = polka().use(
  json(),
  compression({ threshold: 0 }),
  sirv(staticPath, { dev: development }),
  sapper.middleware({
    session: () => ({
      ...config,
      ...(config.exposePluginsConfigOnClient === true ? {} : { plugins: {} })
    })
  })
);

app.listen(port, async (error: Error | string | null) => {
  const host = existsSync("/.dockerenv")
    ? execSync("hostname -i").toString().trim()
    : "localhost";

  if (error) {
    console.log(chalk.redBright(error));
  } else {
    console.log(
      "\n",
      chalk.bold.green("Server:"),
      chalk.magentaBright(`http://${host}:${port}`),
      "\n"
    );

    EventsPipe.emit("server:startup", { port });
  }
});
