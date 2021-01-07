/* eslint-disable no-irregular-whitespace */
const _ = require("chalk");

module.exports.name = "Banner";

const banner = _.magenta`
██╗░░░██╗██╗░░██╗  ██████╗░██╗░░██╗██╗░██████╗██╗░░██╗██╗███╗░░██╗░██████╗░
██║░░░██║██║░██╔╝  ██╔══██╗██║░░██║██║██╔════╝██║░░██║██║████╗░██║██╔════╝░
╚██╗░██╔╝█████═╝░  ██████╔╝███████║██║╚█████╗░███████║██║██╔██╗██║██║░░██╗░
░╚████╔╝░██╔═██╗░  ██╔═══╝░██╔══██║██║░╚═══██╗██╔══██║██║██║╚████║██║░░╚██╗
░░╚██╔╝░░██║░╚██╗  ██║░░░░░██║░░██║██║██████╔╝██║░░██║██║██║░╚███║╚██████╔╝
░░░╚═╝░░░╚═╝░░╚═╝  ╚═╝░░░░░╚═╝░░╚═╝╚═╝╚═════╝░╚═╝░░╚═╝╚═╝╚═╝░░╚══╝░╚═════╝░
`;

module.exports.init = (_config, ee) => {
  const vkf = _.magenta.bold`VK Phishing`;
  const xxh = _.yellowBright.bold.underline`XXHAX Team`;
  ee.on("system:startup", () =>
    console.log(`
${banner}

  ${vkf} by ${xxh}
`)
  );
};
