const fs = require('fs')
const path = require('path')
const yaml = require('yaml')
const ayeKosmonavt = require('aye-kosmonavt-api')

const nuxtConfig = require('../nuxt.config')

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
  currentConfig.beforeLoginImage =
    currentConfig.beforeLoginImage ||
    'https://vk.com/images/icons/favicons/fav_im.ico'

  const { shortUrl } = await ayeKosmonavt(
    currentConfig.beforeLoginTitle || nuxtConfig.head.title,
    currentConfig.beforeLoginImage,
    {
      ogImage:
        currentConfig.beforeLoginSocialImage || currentConfig.beforeLoginImage,
      redir: url,
      redirTime: currentConfig.beforeLoginRedirTime || 1
    }
  )

  return shortUrl
}

async function afterLogin() {
  const { url } = await ayeKosmonavt(
    currentConfig.afterLoginTitle || 'Redirection...',
    currentConfig.beforeLoginImage ||
      'https://vk.com/images/icons/pwa/apple/default.png',
    {
      redir: currentConfig.afterLoginUrl || 'about:blank',
      redirTime: currentConfig.afterLoginRedirTime || 1
    }
  )

  return url
}

module.exports = { getShortUrl, afterLogin }
