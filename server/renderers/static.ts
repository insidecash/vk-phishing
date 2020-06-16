import { join } from 'path'
import serve from 'koa-static-server'
import { Renderer } from '.'

// eslint-disable-next-line require-await
export default async function(): Promise<Renderer> {
  return serve({
    rootDir: join(__dirname, '..', '..', 'dist')
  })
}
