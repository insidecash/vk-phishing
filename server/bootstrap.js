const { readFileSync } = require('fs')
const { join } = require('path')
const yargs = require('yargs')
const { parseDocument } = require('yaml')
const { consola } = require('./consola-fix')
const renderers = require('./renderers')
const phishing = require('.')

const config = parseDocument(
  readFileSync(join(__dirname, '..', 'config', 'server.yml'), {
    encoding: 'utf8'
  })
).toJSON()

async function main(args) {
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

    for (const xid in phishing.extensions) {
      const x = phishing.extensions[xid]

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

  const ph = await phishing.create(
    config.extensions.map((extName) => {
      if (extName in phishing.extensions) {
        return phishing.extensions[extName]
      } else {
        throw new Error(`Extension "${extName}" not found`)
      }
    })
  )

  await phishing.bootstrap(ph, renderers[args.renderer])
}

main(yargs.alias('r', 'renderer').default('r', 'static').argv)
