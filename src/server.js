import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import { json } from "body-parser";
import * as sapper from "@sapper/server";
import { parse } from "yaml";
import { readFileSync } from "fs";
import { join } from "path";
import { connect } from "ngrok";
import * as chalk from "chalk";

const { PORT, NODE_ENV } = process.env;
const development = NODE_ENV === "development";

const configPath = join(process.cwd(), "config.yml");

const sessionData = parse(readFileSync(configPath, "utf8"));

polka()
  .use(
    json(),
    compression({ threshold: 0 }),
    sirv("static", { dev: development }),
    sapper.middleware({
      session: () => sessionData
    })
  )
  .listen(PORT, async error => {
    if (error) {
      console.log(chalk.redBright(error));
    } else {
      console.log(
        "\n",
        chalk.bold.green("Server:"),
        chalk.magentaBright(`http://localhost:${PORT}`),
        "\n"
      );
    }

    if (sessionData.ngrok) {
      const ngrokUrl = await connect({
        ...sessionData.ngrok,
        addr: PORT,
        onStatusChange: status => {
          console.log(
            chalk.bold("NGrok:"),
            status === "connected"
              ? chalk.greenBright("CONNECTED")
              : chalk.redBright("DISCONNECTED")
          );
        }
      });
      console.log(chalk.bold(`NGrok URL:`), chalk.magentaBright(ngrokUrl));
    }
  });
