const app = require('../../server')
const request = require('supertest')(app)

describe('GET /logout', () => {
  test('auth-token', async () => {
    const result = await request
      .get('/logout')
      .set('Cookie', ['auth-token=aaaaa'])
    if (result.err) throw result.err
    expect(result.res.headers['set-cookie']).toEqual(['auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'])
  })

  test('!auth-token', async () => {
    const result = await request
      .get('/logout')

    if (result.err) throw result.err
    expect(result.res.headers['set-cookie']).toEqual(['auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'])
  })
})
