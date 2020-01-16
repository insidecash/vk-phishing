const { Nuxt, Builder } = require('nuxt')
// const c2k = require('koa-connect')
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
    renderer: (ctx) => {
      ctx.status = 200
      ctx.respond = false // Mark request as handled for Koa
      ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
      nuxt.render(ctx.req, ctx.res)
    }
  }
}
