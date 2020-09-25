const router = require('express').Router()
const Tool = require('../models/tool')
const joi = require('../utils/joi')

router.use('*', (req, res, next) => {
  const user = req.user

  if (!user) {
    return res.status(401).send(`Você não está logado.\n\nPor favor, se autentique usando o link: "http://${req.get('host')}"\n\nAviso: a autenticação usa Cookies (auth-token)`).end()
  }
  if (user.authorized !== true) {
    return res.status(401).send('Você está logado, porém você não está autorizado.').end()
  }

  next()
})

router.get('/', async (req, res) => {
  let query

  if (req.query.tag) {
    query = { tags: { $all: req.query.tag } }
  } else {
    query = {}
  }

  try {
    return res.status(200).contentType('application/json').json(await Tool.find(query)).end()
  } catch (e) {
    // Erro na database ou na conexão
    return res.status(500).send('Ocorreu um erro na conexão entre o servidor e a database. Por favor, tente novamente.').end()
  }
})

router.post('/', async (req, res) => {
  if (!req.is('application/json')) {
    return res.status(400).send('O content type necessário é application/json.').end()
  }

  const { error, value } = joi.Tool.validate(req.body)

  if (error) return res.status(400).contentType('application/json').json(error.message).end()

  const tool = await new Tool({
    title: value.title,
    link: value.link,
    description: value.description,
    tags: value.tags
  }).save()

  return res.status(201).contentType('application/json').json(tool).end()
})

router.delete('/:id', async (req, res) => {
  try {
    await Tool.findByIdAndDelete(req.params.id)
    return res.status(204).end()
  } catch (e) {
    if (e.reason.toString().startsWith('Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters')) {
      // Tool Id inválido
      return res.status(400).send('O ID da tool é inválido.').end()
    } else {
      // Erro na database ou na conexão
      return res.status(500).send('Ocorreu um erro na conexão entre o servidor e a database. Por favor, tente novamente.').end()
    }
  }
})

module.exports = router
