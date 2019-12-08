const consola = require('consola')
const chalk = require('chalk')
const userbot = require('../userbot')
const { R_SUCCESS, R_REQUIRE_2FA } = require('../auth-constants')

module.exports = (req, res) => {
  consola.log()

  consola.info({
    label: true,
    message: 'Trying authenticate with credentials'
  })

  const input = chalk.bold.blueBright('>')
  const outputSuccess = chalk.bold.green('< ')
  const outputFail = chalk.bold.red('< ')

  consola.log(`${input} Login: ${req.body.username}`)
  consola.log(`${input} Login: ${req.body.password}`)

  userbot(req.body).then((json) => {
    if (json.status === R_SUCCESS) {
      consola.log(outputSuccess + 'Success!')
    } else if (json.status === R_REQUIRE_2FA) {
      consola.log(outputFail + 'Required 2FA!')
    } else {
      consola.log(outputFail + 'Failed!')
    }

    consola.log()

    res.json(json)
  })
}
