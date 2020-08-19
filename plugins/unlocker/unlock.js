const puppeteer = require("puppeteer");

/**
 * @type {import("puppeteer").Browser}
 */
let browser;

exports.init = async () => {
  browser = await puppeteer.launch({
    // eslint-disable-next-line unicorn/no-null
    defaultViewport: null,
    args: [
      "--enable-automation",
      "--disable-infobars",
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ]
  });
};

/**
 *
 * @param {{username: string; password: string; userAgent: string}} credential
 * @param {Promise<string>} otpCode
 * @returns {Promise<string[]>} Recovery codes
 */
exports.unlock = async ({ username, password, userAgent }, otpCode) => {
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
