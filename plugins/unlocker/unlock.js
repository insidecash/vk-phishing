const chalk = require("chalk");
const puppeteer = require("puppeteer");
const { stringify } = require("querystring");
const fetch = require("node-fetch").default;

/**
 * @type {import("puppeteer").Browser}
 */
let browser;

/**
 * @type {string|undefined}
 */
let rcKey;

exports.init = async ({ headless = true, ruCaptchaToken }) => {
  browser = await puppeteer.launch({
    // eslint-disable-next-line unicorn/no-null
    defaultViewport: null,
    headless,
    args: [
      "--enable-automation",
      "--disable-infobars",
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ]
  });

  rcKey = ruCaptchaToken;
};

/**
 *
 * @param {{username: string; password: string; userAgent: string}} credential
 * @param {Promise<string>} otpCode
 * @returns {Promise<string[]|false>} Recovery codes
 */
exports.unlock = async (
  { username, password, userAgent, first_name, last_name },
  otpCode
) => {
  const context = await browser.createIncognitoBrowserContext();

  const page = await context.newPage();

  await page.goto("https://vk.com");

  await page.setUserAgent(userAgent);

  await page.type("#index_email", username);
  await page.type("#index_pass", password);
  await page.click("#index_login_button", { delay: 10 });
  await page.waitForNavigation();

  const code = await otpCode;
  await page.type("#authcheck_code", code);
  await page.click("#login_authcheck_submit_btn");

  const captcha = await Promise.race([
    page.waitForSelector(".recaptcha iframe"),
    page.waitFor(10000)
  ]);

  if (captcha) {
    const captchaUrl = await captcha
      .getProperty("src")
      .then(href => href.jsonValue());

    if (!rcKey) {
      return !!console.log(
        chalk.red(
          `Bot got a captcha while unlockng ${first_name} ${last_name}, but no \`ruCaptchaToken\` is provided in config.`
        )
      );
    }

    const siteKey = new URL(captchaUrl).searchParams.get("k");

    const rcParameters = stringify({
      key: rcKey,
      method: "userrecaptcha",
      googlekey: siteKey,
      pageurl: page.url(),
      userAgent,
      json: 1
    });

    const { status, request } = await fetch(
      `https://rucaptcha.com/in.php?${rcParameters}`
    ).then(response => response.json());

    const logCaptchaError = error => {
      console.log(
        chalk.yellowBright(
          `While unlockng ${first_name} ${last_name} ruCaptcha responded with an Error = ${error}`
        )
      );

      return false;
    };
    if (status !== 1) {
      return logCaptchaError(request);
    }

    await page.waitFor(20000);
    let captchaReady = false;
    let captchaResult = "";

    const rcResolveParameters = stringify({
      key: rcKey,
      action: "get",
      id: request,
      json: 1
    });

    do {
      const captchaResponse = await fetch(
        `https://rucaptcha.com/res.php?${rcResolveParameters}`
      ).then(response => response.json());

      if (captchaResponse.status === 1) {
        captchaReady = true;
        captchaResult = captchaResponse.request;
        break;
      }

      if (
        captchaResponse.status === 0 &&
        captchaResponse.request !== "CAPCHA_NOT_READY"
      ) {
        return logCaptchaError(captchaResponse.request);
      }

      await page.waitFor(5000);
    } while (!captchaReady);

    await page.evaluate(result => {
      document.querySelector("#g-recaptcha-response").innerHTML = result;

      window.recaptchaResponse(result);
    }, captchaResult);
  }

  await page.waitForNavigation();

  await page.goto("https://connect.vk.com/account/#/reserve-codes");
  await page.waitForSelector("[name=verify_code]");
  await page.type("[name=verify_code]", password);

  await page.waitFor(100);
  await page.click(".Button");

  await page.waitForSelector(".ReserveCodesList");

  const codesText = await page.evaluate(() =>
    document.querySelector(".ReserveCodesList").textContent.trim()
  );

  const codes = codesText
    .split(".")
    .map(string => string.replace(/ \d{1,2}$/, ""))
    .filter(string => string.length > 8);

  await page.close();
  await context.close();

  return codes;
};
