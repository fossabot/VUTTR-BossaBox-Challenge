const Joi = require('joi')

module.exports = {
  Tool: (Joi.object({
    title: Joi.string().required(),
    link: Joi.string().uri().required(),
    description: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required()
  }).options({ stripUnknown: true }))
}
