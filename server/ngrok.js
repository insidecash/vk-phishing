const fs = require('fs')
const path = require('path')
const ngrok = require('ngrok')
const yaml = require('yaml')

const localNgrokConfigPath = path.join(__dirname, '..', 'config', 'ngrok.yml')
const globalNgrokConfigPath = path.join(process.env.HOME, '.ngrok', 'ngrok.yml')

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

module.exports = async function connect(port = 3000) {
  const publicURL = await ngrok.connect({
    configPath: ngrokConfigPath,
    addr: port,
    onStatusChange: (status) => {
      if (status === 'closed') {
        ngrok.kill()

        throw new Error('Ngrok tunnel has been disconnected')
      } else if (status === 'connected') {
      }
    }
  })

  return publicURL
}
