const router = require('express').Router()
const { Google } = require('../utils/oauth')
const { getOrCreateUser } = require('../utils/misc')
const jwt = require('jsonwebtoken')

async function auth (loginId, method, req, res) {
  const userResult = await getOrCreateUser(loginId, 'Google')
  switch (userResult.status) {
    case 200 || 201: {
      const token = jwt.sign({ _id: userResult.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
      res.cookie('auth-token', token, { signed: true })
      return res.status(userResult.status).redirect('../../')
    }
    default: {
      return res.status(userResult.status).send(`${userResult.statusText}\n\n${tryAgainMessage(req.get('host'))}`).end()
    }
  }
}

function tryAgainMessage (host) {
  return `Por favor, tente novamente usando o link: http://${host}`
}

router.get('/google', async (req, res) => {
  if (req.query.scope && req.query.code) {
    if (req.query.scope.split(' ').includes('email')) {
      const loginIdResult = await Google.getLoginIdentifier(req.query.code)
      if (loginIdResult.err === null && loginIdResult.identifier !== undefined) {
        return auth(loginIdResult.identifier, 'Google', req, res)
      } else {
        return res.status(loginIdResult.err.code).send(`${loginIdResult.err.message}\n\n${tryAgainMessage(req.get('host'))}`).end()
      }
    }
  }

  res.status(400).send(`Por favor, tente novamente usando o link: http://${req.get('host')}`).end()
})

module.exports = router
