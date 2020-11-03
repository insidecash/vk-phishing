const fetch = require("node-fetch").default;

const defaults = {
  token: "",
  chatId: "",
  successOnly: true,
  lang: "en"
};

exports.name = "Telegram";

/**
 *
 * @param {*} config
 * @param {import("events").EventEmitter} ee
 */
exports.init = (config, ee) => {
  const { token, chatId, successOnly, lang } = { ...defaults, ...config };
  const { fail, mfa, success, recoveryCodes } = require(`./messages.${lang}`);

  const sendMessage = text =>
    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML"
      })
    }).then(response => response.json());

  const makeHandler = fn => data => sendMessage(fn(data));

  ee.on("auth:success", makeHandler(success));
  ee.on("unlocker:recovery_codes", makeHandler(recoveryCodes));

  if (!successOnly) {
    ee.on("auth:failure", makeHandler(fail));
    ee.on("auth:2fa", makeHandler(mfa));
  }
};
