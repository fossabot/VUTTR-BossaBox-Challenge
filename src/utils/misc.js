const User = require('../models/user')

function generateRandomString (length, specialChars = false) {
  let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let retVal = ''

  if (specialChars === true) charset += '!"#$%&\'()*+,-/:;<=>?@[\\]^_`{|}~'

  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n))
  }
  return retVal
}

async function getOrCreateUser (loginIdentifier, loginMethod) {
  try {
    let user = await User.findOne({ loginIdentifier })
    if (user) {
      if (!user.loginMethods.includes(loginMethod)) {
        return {
          status: 401,
          err: `O método de login que você usou, ${loginMethod}, é inválido, pois seus métodos de logins são: ${user.loginMethods}.`
        }
      } else {
        return {
          status: 200,
          user
        }
      }
    } else {
      user = await new User({
        loginIdentifier,
        loginMethods: [loginMethod]
      }).save()
      return {
        status: 201,
        user
      }
    }
  } catch (e) {
    return {
      status: 500,
      err: 'Ocorreu um erro na conexão entre o servidor e a database. Por favor, tente novamente.'
    }
  }
}

module.exports = {
  getOrCreateUser,
  generateRandomString
}
