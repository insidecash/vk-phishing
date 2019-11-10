const cheerio = require('cheerio')
const request = require('request-promise-native')

async function ayeKosmonavt(title, img, { ogImage, redir, redirTime } = {}) {
  const opts = { title, url: img }

  if (ogImage) {
    opts.ogimage = ogImage
  }
  if (redir) {
    opts.redir = redir
  }
  if (redirTime) {
    opts.rt = redirTime
  }

  const html = await request.post('https://aye-kosmonavt.space/gen.php', {
    form: opts
  })

  const $ = cheerio.load(html)

  const url = $('#result-url').val()
  const shortUrl = $('#shorten-result-url').val()

  return { url, shortUrl }
}

module.exports = ayeKosmonavt
