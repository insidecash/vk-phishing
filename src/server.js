import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import { json } from "body-parser";
import * as sapper from "@sapper/server";
import * as chalk from "chalk";
import { config, EventsPipe } from "./system";

const port = config.port || 3000;
process.env.PORT = port;

const development = process.env.NODE_ENV === "development";

polka()
  .use(
    json(),
    compression({ threshold: 0 }),
    sirv("static", { dev: development }),
    sapper.middleware({
      session: () => config
    })
  )
  .listen(port, async error => {
    if (error) {
      console.log(chalk.redBright(error));
    } else {
      console.log(
        "\n",
        chalk.bold.green("Server:"),
        chalk.magentaBright(`http://localhost:${port}`),
        "\n"
      );

      EventsPipe.emit("server:startup", { port });
    }
  });
