const { setupDB } = require('../../../test_modules/setup')

setupDB('test0')

const app = require('../../server')
const request = require('supertest')(app)

const OAuth = require('../../utils/oauth')

const { generateVerboseRandomUser, invalidUsers } = require('../../../test_modules/misc')

const unauthResponse = {}
Object.keys(OAuth).forEach((key) => {
  unauthResponse[key] = OAuth[key].authUrl
})

describe('GET /', () => {
  test('auth-token && usuário autorizado', async () => {
    const user = await generateVerboseRandomUser()

    const result = await request
      .get('/')
      .set('Cookie', [`auth-token=${user.cookie}`])

    if (result.err) throw result.err

    expect(result.status).toEqual(200)
    expect(result.text.toString()).toEqual('Você está autenticado!')
  })

  test('auth-token && usuário não autorizado', async () => {
    const user = await generateVerboseRandomUser(false)

    const result = await request
      .get('/')
      .set('Cookie', [`auth-token=${user.cookie}`])

    if (result.err) throw result.err

    expect(result.status).toEqual(200)
    expect(result.text.toString()).toEqual('Você está autenticado!')
  })

  test('auth-token && !usuário (sintaxe inválida)', async () => {
    const result = await request
      .get('/')
      .set('Cookie', [`auth-token=${invalidUsers.invalidSyntax.cookie}`])

    if (result.err) throw result.err

    expect(result.status).toEqual(401)
    expect(result.text.toString()).toEqual(JSON.stringify(unauthResponse))
  })

  test('auth-token && !usuário (sintaxe válida)', async () => {
    const result = await request
      .get('/')
      .set('Cookie', [`auth-token=${invalidUsers.validSyntax.cookie}`])

    if (result.err) throw result.err

    expect(result.status).toEqual(401)
    expect(result.text.toString()).toEqual(JSON.stringify(unauthResponse))
  })

  test('!auth-token && !usuário', async () => {
    const result = await request
      .get('/')
      .set('Cookie', ['auth-token=aaaaa'])

    if (result.err) throw result.err

    expect(result.status).toEqual(401)
    expect(result.text.toString()).toEqual(JSON.stringify(unauthResponse))
  })

  test('sem o Cookie auth-token', async () => {
    const result = await request
      .get('/')

    if (result.err) throw result.err

    expect(result.status).toEqual(401)
    expect(result.text.toString()).toEqual(JSON.stringify(unauthResponse))
  })
})
