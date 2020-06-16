import { Middleware } from 'koa'

export { default as nuxt } from './nuxt'
export { default as static } from './static'

export type Renderer = Middleware
export type RendererGetter = () => Renderer | Promise<Renderer>
