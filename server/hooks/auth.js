const userbot = require('../userbot').default

module.exports = function(req, res) {
  // console.log(req.url)

  userbot(req.body).then((json) => res.json(json))
}
