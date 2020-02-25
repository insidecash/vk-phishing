const fs = require('fs')
const path = require('path')
const ngrok = require('ngrok')
const yaml = require('yaml')
const declareExtension = require('./_')

module.exports = declareExtension(
  (instance, extensions) => {
    const localNgrokConfigPath = path.join(
      __dirname,
      '..',
      '..',
      'config',
      'ngrok.yml'
    )
    const globalNgrokConfigPath = path.join(
      process.env.HOME,
      '.ngrok',
      'ngrok.yml'
    )

    let ngrokConfigPath
    const existsLocalConfig = fs.existsSync(localNgrokConfigPath)
    const existsGlobalConfig = fs.existsSync(globalNgrokConfigPath)

    if (existsLocalConfig) {
      ngrokConfigPath = localNgrokConfigPath
    } else if (existsGlobalConfig) {
      ngrokConfigPath = globalNgrokConfigPath
    } else {
      const config = yaml.stringify({
        region: 'eu'
      })

      fs.writeFileSync(localNgrokConfigPath, config, { encoding: 'utf8' })

      ngrokConfigPath = localNgrokConfigPath
    }

    instance.on('start', async ({ port }) => {
      const publicURL = await ngrok.connect({
        configPath: ngrokConfigPath,
        addr: port,
        onStatusChange: (status) => {
          if (status === 'closed') {
            ngrok.kill()
            const err = new Error('Ngrok tunnel has been disconnected')

            instance.emit('ngrok:error', err)

            if (existsLocalConfig) {
              const cnf = yaml.parse(
                fs.readFileSync(localNgrokConfigPath, { encoding: 'utf8' })
              )

              if (cnf && cnf.exposeDisconnected === false) {
                return null
              } else {
                throw err
              }
            } else {
              throw err
            }
          } else if (status === 'connected') {
            instance.emit('ngrok:connected')
          }
        }
      })

      instance.emit('ngrok:ready-url', publicURL)
    })

    return instance
  },
  {
    name: 'ngrok',
    description:
      'Extension allows bypass nat and allow access to link on the internet'
  }
)
