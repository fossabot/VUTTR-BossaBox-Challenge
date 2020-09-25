const router = require('express').Router()
const OAuth = require('../utils/oauth')

router.get('/', async (req, res) => {
  if (req.user === undefined) {
    const auths = {}
    Object.keys(OAuth).forEach((key) => {
      auths[key] = OAuth[key].authUrl
    })
    res.status(200).send(auths).end()
  } else {
    res.status(200).send('Você está autenticado!').end()
  }
})

module.exports = router
