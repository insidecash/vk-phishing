const { join } = require('path')
const serve = require('koa-static-server')
const config = require('../../nuxt.config')

const existHostConfig = config.server && config.server.host
const existPortConfig = config.server && config.server.port

// eslint-disable-next-line require-await
module.exports = async function() {
  return {
    host: existHostConfig ? config.server.host : 'localhost',
    port: existPortConfig ? config.server.port : 3000,
    renderer: serve({
      rootDir: join(__dirname, '..', '..', 'dist')
    })
  }
}
