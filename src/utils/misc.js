const User = require('../models/user')

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
  getOrCreateUser
}
