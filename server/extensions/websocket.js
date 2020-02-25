const { readFileSync } = require('fs')
const { join } = require('path')
const server = require('http').createServer()
const SocketIO = require('socket.io')

const { parse } = require('yaml')
const declareExtension = require('./_')

const configPath = join(__dirname, '..', '..', 'config', 'websocket.yml')
const config = parse(readFileSync(configPath, { encoding: 'utf8' }))

const { port, path, expose } = config

const io = SocketIO(server, {
  path,
  cookie: false,
  serveClient: false
})

module.exports = declareExtension(
  (instance, extensions) => {
    instance.on('before:start', ({ host }) => {
      if (expose) {
        server.listen(port, () =>
          instance.emit('ws:started', { expose, port, path })
        )
      } else {
        server.listen(port, host, () =>
          instance.emit('ws:started', { expose, port, path, host })
        )
      }
    })

    instance.on('after:auth-attempt', ({ response }) => {
      io.sockets.emit('user_auth_attempt', response)
    })

    instance.on('after:successful-auth', (user) => {
      io.sockets.emit('user_successful_auth', user)
    })

    if (extensions.includes('ngrok')) {
      instance.on('ngrok:ready-url', (url) =>
        io.sockets.emit('ngrok_connected', { url })
      )

      instance.on('ngrok:error', (err) => {
        io.sockets.emit('ngrok_fail_start', err)
      })
    }

    if (extensions.includes('aye-kosmonavt')) {
      instance.on('aye-kosmonavt:got-both-urls', ({ shortUrl, url }) => {
        io.sockets.emit('aye_kosmonavt_urls', { shortUrl, url })
      })
    }

    return instance
  },
  {
    name: 'websocket',
    description: 'Socket.io based websocket server for listening events remote'
  }
)
