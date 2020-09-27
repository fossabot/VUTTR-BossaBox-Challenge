/* eslint-disable jest/no-commented-out-tests */
const { setupDB } = require('../../../test_modules/setup')

setupDB('test1', false)

const mongoose = require('mongoose')
const app = require('../../server')
const request = require('supertest')(app)

const { generateVerboseRandomUser, invalidUsers } = require('../../../test_modules/misc')
const joi = require('../../utils/joi')
const Tool = require('../../models/tool')

const toolsTemplate = require('../../../toolsTemplate.json')

beforeAll(async () => {
  toolsTemplate.forEach(async (toolTemplate) => {
    await (new Tool({
      title: toolTemplate.title,
      link: toolTemplate.link,
      description: toolTemplate.description,
      tags: toolTemplate.tags
    }).save())
  })
})

afterEach(async () => {
  const collection = mongoose.connection.collections.users
  await collection.deleteMany()
})

describe('POST /tools', () => {
  test('tool', async () => {
    const user = await generateVerboseRandomUser()

    const fakeTool = {
      tags: [
        'a',
        'b',
        'c'
      ],
      title: 'A',
      link: 'https://B.CD',
      description: 'E'
    }

    const result = await request
      .post('/tools')
      .set('Cookie', [`auth-token=${user.cookie}`])
      .send(fakeTool)

    if (result.err) throw result.err

    const { error, value } = joi.Tool.validate(JSON.parse(result.text))
    if (error) throw error

    expect(result.status).toBe(201)
    expect(value).toMatchObject(fakeTool)

    const tool = await Tool.findById(JSON.parse(result.text)._id)
    await tool.deleteOne()
  })

  test('tool.tags = []', async () => {
    const user = await generateVerboseRandomUser()

    const fakeTool = {
      tags: [],
      title: 'A',
      link: 'https://B.CD',
      description: 'E'
    }

    const result = await request
      .post('/tools')
      .set('Cookie', [`auth-token=${user.cookie}`])
      .send(fakeTool)

    if (result.err) throw result.err

    const { error, value } = joi.Tool.validate(JSON.parse(result.text))
    if (error) throw error

    expect(result.status).toBe(201)
    expect(value).toMatchObject(fakeTool)

    const tool = await Tool.findById(JSON.parse(result.text)._id)
    await tool.deleteOne()
  })
})

describe('GET /tools', () => {
  test('Sem parâmetros', async () => {
    const user = await generateVerboseRandomUser()

    const result = await request
      .get('/tools')
      .set('Cookie', [`auth-token=${user.cookie}`])

    if (result.err) throw result.err

    const tools = []

    JSON.parse(result.text).forEach((tool) => {
      const { error, value } = joi.Tool.validate(tool)
      if (error) throw error
      tools.push(value)
    })

    expect(result.status).toEqual(200)
    expect(tools).toEqual(toolsTemplate)
  })

  test('?tag=', async () => {
    const user = await generateVerboseRandomUser()

    const result = await request
      .get('/tools?tag=')
      .set('Cookie', [`auth-token=${user.cookie}`])

    if (result.err) throw result.err

    const tools = []

    JSON.parse(result.text).forEach((tool) => {
      const { error, value } = joi.Tool.validate(tool)
      if (error) throw error
      tools.push(value)
    })

    expect(result.status).toEqual(200)
    expect(tools).toEqual(toolsTemplate)
  })

  test('?tag=a', async () => {
    const user = await generateVerboseRandomUser()

    const result = await request
      .get('/tools?tag=a')
      .set('Cookie', [`auth-token=${user.cookie}`])

    if (result.err) throw result.err

    const tools = []

    JSON.parse(result.text).forEach((tool) => {
      const { error, value } = joi.Tool.validate(tool)
      if (error) throw error
      tools.push(value)
    })

    expect(result.status).toEqual(200)
    expect(tools).toEqual([])
  })

  test('?tag=node', async () => {
    const user = await generateVerboseRandomUser()

    const result = await request
      .get('/tools?tag=node')
      .set('Cookie', [`auth-token=${user.cookie}`])

    if (result.err) throw result.err

    const tools = []

    JSON.parse(result.text).forEach((tool) => {
      const { error, value } = joi.Tool.validate(tool)
      if (error) throw error
      tools.push(value)
    })

    expect(result.status).toEqual(200)
    expect(tools).toEqual(toolsTemplate.filter(({ tags }) => tags.includes('node')))
  })

  test('?tag=calendar', async () => {
    const user = await generateVerboseRandomUser()

    const result = await request
      .get('/tools?tag=calendar')
      .set('Cookie', [`auth-token=${user.cookie}`])

    if (result.err) throw result.err

    const tools = []

    JSON.parse(result.text).forEach((tool) => {
      const { error, value } = joi.Tool.validate(tool)
      if (error) throw error
      tools.push(value)
    })

    expect(result.status).toEqual(200)
    expect(tools).toEqual(toolsTemplate.filter(({ tags }) => tags.includes('calendar')))
  })
})

function notLoggedIn (text) {
  return (
    text.startsWith('Você não está logado.\n\nPor favor, se autentique usando o link: "http://') &&
    text.endsWith('"\n\nAviso: a autenticação usa Cookies (auth-token)')
  )
}

describe('Auth /tools', () => {
  test('auth-token && usuário autorizado', async () => {
    const user = await generateVerboseRandomUser()

    const result = await request
      .get('/tools')
      .set('Cookie', [`auth-token=${user.cookie}`])

    if (result.err) throw result.err

    const tools = []

    JSON.parse(result.text).forEach((tool) => {
      const { error, value } = joi.Tool.validate(tool)
      if (error) throw error
      tools.push(value)
    })

    expect(result.status).toEqual(200)
    expect(tools).toEqual(toolsTemplate)
  })

  test('auth-token && usuário não autorizado', async () => {
    const user = await generateVerboseRandomUser(false)

    const result = await request
      .get('/tools')
      .set('Cookie', [`auth-token=${user.cookie}`])

    if (result.err) throw result.err

    expect(result.status).toEqual(401)
    expect(result.text).toEqual('Você está logado, porém você não está autorizado.')
  })

  test('auth-token && !usuário (sintaxe inválida)', async () => {
    const result = await request
      .get('/tools')
      .set('Cookie', [`auth-token=${invalidUsers.invalidSyntax.cookie}`])

    if (result.err) throw result.err

    expect(result.status).toEqual(401)
    expect(notLoggedIn(result.text)).toBe(true)
  })

  test('auth-token && !usuário (sintaxe válida)', async () => {
    const result = await request
      .get('/tools')
      .set('Cookie', [`auth-token=${invalidUsers.validSyntax.cookie}`])

    if (result.err) throw result.err

    expect(result.status).toEqual(401)
    expect(notLoggedIn(result.text)).toBe(true)
  })

  test('!auth-token && !usuário', async () => {
    const result = await request
      .get('/tools')
      .set('Cookie', ['auth-token=aaaaa'])

    if (result.err) throw result.err

    expect(result.status).toEqual(401)
    expect(notLoggedIn(result.text)).toBe(true)
  })

  test('sem o Cookie auth-token', async () => {
    const result = await request
      .get('/tools')

    if (result.err) throw result.err

    expect(result.status).toEqual(401)
    expect(notLoggedIn(result.text)).toBe(true)
  })
})
