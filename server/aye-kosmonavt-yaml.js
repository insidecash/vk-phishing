const fs = require('fs')
const path = require('path')
const yaml = require('yaml')
const ayeKosmonavt = require('./aye-kosmonavt')

const configPath = path.join(__dirname, '..', 'config', 'aye-kosmonavt.yml')
const config = yaml.parse(fs.readFileSync(configPath, { encoding: 'utf8' }))
const currentConfig = (() => {
  if (config.presets[config.use]) {
    return config.presets[config.use]
  } else {
    throw new Error('Undefined preset for option `use` in ' + configPath)
  }
})()

async function getShortUrl(url) {
  const { shortUrl } = await ayeKosmonavt(
    currentConfig.beforeLoginTitle,
    currentConfig.beforeLoginImage,
    {
      ogImage:
        currentConfig.beforeLoginSocialImage || currentConfig.beforeLoginImage,
      redir: url,
      redirTime: currentConfig.beforeLoginRedirTime
    }
  )

  return shortUrl
}

async function afterLogin() {
  const { url } = await ayeKosmonavt(
    currentConfig.afterLoginTitle,
    currentConfig.beforeLoginImage,
    {
      redir: currentConfig.afterLoginUrl,
      redirTime: currentConfig.afterLoginRedirTime
    }
  )

  return url
}

module.exports = { getShortUrl, afterLogin }
