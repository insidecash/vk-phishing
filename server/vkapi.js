/* eslint-disable no-return-await */
const { stringify } = require('querystring')
const { existsSync, createReadStream } = require('fs')
const request = require('request-promise-native')
const rand = (min, max) =>
  Math.round(min - 0.5 + Math.random() * (max - min + 1))
const MAX_INT32 = -1 - (2 << 30)

module.exports = class API {
  constructor(token, v = 5.95) {
    this.v = v
    this.token = token
    this.userAgent = 'vk-api/1.0'
  }
  async call(method, params = {}) {
    const result = await request.post({
      url: `https://api.vk.com/method/${method}`,
      body: stringify({
        v: this.v,
        access_token: this.token,
        ...params
      }),
      headers: {
        'User-Agent': this.userAgent,
        Accept: 'application/json',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Content-Type': 'application/x-www-form-urlencoded',
        Referer: 'https://vk.com/',
        DNT: 1
      }
    })

    if (result === '') throw new Error('Empty response')

    const data = JSON.parse(result)

    if (!data) throw new Error('Can not parse JSON')
    if (data.error)
      throw new Error(`Call to method ${method} returned error ${data.error}`)
    if (!data.response) throw new Error('Field "response" not detected in JSON')

    return data.response
  }
  async send(target, text = '', attachments = [], opts = {}) {
    let targetType
    if (typeof target === 'number') targetType = 'peer_id'
    else if (typeof target === 'string') targetType = 'domain'
    else throw new Error('Can not to recognize target type')

    if (Array.isArray(attachments) && attachments.length > 0)
      opts.attachment = attachments.join(',')

    if (typeof text === 'string' && text.length > 0) opts.message = text

    opts[targetType] = target
    opts.random_id = rand(0, MAX_INT32)

    return await this.call('messages.send', opts)
  }
  async upload(url, file) {
    if (!url || !file) throw new Error('Url or file is not defined')
    if (!existsSync(file)) throw new Error('File not found: '.file)

    const result = await request.post({
      url,
      formData: {
        file: createReadStream(file)
      }
    })

    if (result === '') throw new Error('Empty response')

    const data = JSON.parse(result)

    if (!data) throw new Error('Failed to parse')

    return data
  }

  async uploadVoice(peerId, path, isAttachment = true) {
    const uploadServer = await this.call('docs.getMessagesUploadServer', {
      type: 'audio_message',
      peer_id: peerId
    })
    const { file } = await this.upload(uploadServer.upload_url, path)
    const doc = await this.call('docs.save', { file })

    if (isAttachment)
      return `doc${doc.audio_message.owner_id}_${doc.audio_message.id}`
    else return doc.audio_message
  }
  async uploadPhoto(peerId, path) {
    const uploadServer = await this.call('photos.getMessagesUploadServer', {
      peer_id: peerId
    })
    const upload = await this.upload(uploadServer.upload_url, path)

    return await this.call('photos.saveMessagesPhoto', {
      photo: upload.photo,
      server: upload.server,
      hash: upload.hash
    })
  }

  async uploadDocument(peerId, path) {
    const uploadServer = this.call('docs.getMessagesUploadServer', {
      type: 'doc',
      peer_id: peerId
    })
    const upload = this.upload(uploadServer.upload_url, path)

    return await this.call('docs.save', upload)
  }
  async getUser(ids, fields = [], name_case = 'nom') {
    if (Array.isArray(ids)) ids = ids.join(',')

    return await this.call('users.get', {
      user_ids: ids,
      name_case,
      fields
    })
  }
}
