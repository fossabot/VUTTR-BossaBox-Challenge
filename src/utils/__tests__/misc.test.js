const { setupDB } = require('../../../test_modules/setup')

setupDB('test2')

const User = require('../../models/user')
const { getOrCreateUser } = require('../misc')

describe('function getOrCreateUser', () => {
  test('create user', async () => {
    expect((await User.find())).toHaveLength(0)
    const result = await getOrCreateUser('aaaaa', 'bbbbb')
    
    expect(result.status).toBe(201)
    expect(result.user.loginIdentifier).toBe('aaaaa')
    expect(result.user.loginMethods).toHaveLength(1)
    expect(result.user.loginMethods[0]).toBe('bbbbb')

    User.deleteOne({ _id: result.user._id })
  })

  test('find unauthorized user', async () => {
    const user = await new User({
      loginIdentifier: 'ccccc',
      loginMethods: ['ddddd'],
      authorized: false
    }).save()

    const result = await getOrCreateUser('ccccc', 'ddddd')

    expect(result.status).toBe(200)
    expect(result.user._id).toEqual(user._id)
    expect(result.user.loginIdentifier).toBe('ccccc')
    expect(result.user.loginMethods).toHaveLength(1)
    expect(result.user.loginMethods[0]).toBe('ddddd')
    expect(result.user.authorized).toBe(false)
  })

  test('find authorized user', async () => {
    const user = await new User({
      loginIdentifier: 'ccccc',
      loginMethods: ['ddddd'],
      authorized: true
    }).save()

    const result = await getOrCreateUser('ccccc', 'ddddd')

    expect(result.status).toBe(200)
    expect(result.user._id).toEqual(user._id)
    expect(result.user.loginIdentifier).toBe('ccccc')
    expect(result.user.loginMethods).toHaveLength(1)
    expect(result.user.loginMethods[0]).toBe('ddddd')
    expect(result.user.authorized).toBe(true)
  })
})
