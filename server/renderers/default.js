const { Nuxt, Builder } = require('nuxt')
const config = require('../../nuxt.config')

module.exports = async function() {
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  return {
    host,
    port,
    renderer: nuxt.render
  }
}
