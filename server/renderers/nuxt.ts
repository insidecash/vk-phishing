const { Nuxt, Builder } = require('nuxt')
// const c2k = require('koa-connect')
import config from '../../nuxt.config'
import { Context } from 'koa'
import { Renderer } from '.'

export default async function(): Promise<Renderer> {
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  return (ctx: Context) => {
    ctx.status = 200
    ctx.respond = false // Mark request as handled for Koa
    nuxt.render(ctx.req, ctx.res)
  }
}
