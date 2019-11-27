const { join } = require('path')
const express = require('express')
const config = require('../../nuxt.config')

const existHostConfig = config.server && config.server.host
const existPortConfig = config.server && config.server.port

// eslint-disable-next-line require-await
module.exports = async function() {
  return {
    host: existHostConfig ? config.server.host : 'localhost',
    port: existPortConfig ? config.server.port : 3000,
    renderer: express.static(join(__dirname, '..', '..', 'dist'))
  }
}
