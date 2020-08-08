import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import { json } from "body-parser";
import * as sapper from "@sapper/server";
import * as chalk from "chalk";
import { config, EventsPipe } from "./system";

const { PORT, NODE_ENV } = process.env;
const development = NODE_ENV === "development";

polka()
  .use(
    json(),
    compression({ threshold: 0 }),
    sirv("static", { dev: development }),
    sapper.middleware({
      session: () => config
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

      EventsPipe.emit("server:startup", { port: PORT });
    }
  });
