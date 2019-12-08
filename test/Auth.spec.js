import { R_ERROR_INVALID_CREDENTIALS } from '../server/auth-constants'

const userbot = require('../server/userbot')

describe('Authentication', () => {
  test('Invalid data should return an error', () => {
    return userbot({ username: 'Pupkin', password: 'Zolupkin' }).then((data) =>
      expect(data.status).toBe(R_ERROR_INVALID_CREDENTIALS)
    )
  })
})
