const router = require('express').Router()
const { Google } = require('../utils/oauth')

router.get('/google', async (req, res) => {
  if (req.query.scope && req.query.code) {
    if (req.query.scope.split(' ').includes('email')) {
      const idResult = await Google.getIdentifier(req.query.code)
      if (idResult.err === null && idResult.identifier !== undefined) {
      } else {
        res.status(idResult.status).send(idResult.statusText).end()
      }
    }
  }

  res.status(400).send(`Por favor, tente novamente usando o link: http://${req.get('host')}`).end()
})

module.exports = router
