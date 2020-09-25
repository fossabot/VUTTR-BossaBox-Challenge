const router = require('express').Router()

router.get('/', async (req, res) => {
  res.clearCookie('auth-token')
  return res.status(200).send('Logged out').end()
})

module.exports = router
