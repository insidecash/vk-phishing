const { existsSync } = require('fs')
const { join } = require('path')

const express = require('express')
const consola = require('consola')

const app = express()
const bodyParser = require('body-parser')

const config = require('../nuxt.config')
const ngrok = require('./ngrok')

// Import and Set Nuxt.js options
config.dev = process.env.NODE_ENV !== 'production'

const { getShortUrl, afterLogin } = require('./aye-kosmonavt-yaml')

async function start(r) {
  // Init Nuxt.js

  let rendererPath = `./renderers/${r}`

  if (
    !existsSync(join(__dirname, rendererPath + '.js')) ||
    typeof r !== 'string'
  ) {
    rendererPath = `./renderers/default`
    consola.error({
      message: `Renderer ${r} not found, used default instead`,
      badge: true
    })
  } else {
    consola.success(`Used renderer: ${r}`)
  }

  const server = require(rendererPath)

  const { host, port, renderer } = await server()

  // const accounts = []

  // Give nuxt middleware to express

  app.post('/auth', bodyParser.json(), require('./hooks/auth'))

  app.post('/done', bodyParser.json(), require('./hooks/done'))

  app.get('/exit', async (_uReq, res) => res.redirect(await afterLogin()))

  app.use(renderer)

  // Listen the server
  app.listen(port, host)

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })

  // consola.info(`Admin started: http://${host}:${port}/admin/`)

  if (config.dev) {
    consola.info(`Listening dev url: http://${host}:${port}`)
  } else {
    try {
      const publicUrl = await ngrok(port)

      consola.info(`Listening public url: ${publicUrl}`)

      const shortUrl = await getShortUrl(publicUrl)

      consola.info(`Shorten url is: ${shortUrl}`)
    } catch (e) {
      consola.error(e)
    }
  }
}

let renderer

if (config.dev) {
  renderer = 'default'
} else {
  renderer = 'generated'
}

start(renderer)

process
  .on('unhandledRejection', (reason, p) => {
    consola.error(reason, 'Unhandled Rejection at Promise', p)
  })
  .on('uncaughtException', (err) => {
    consola.error(err, 'Uncaught Exception thrown')
    process.exit(1)
  })
