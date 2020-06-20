const boom = require('@hapi/boom')
const joi = require('@hapi/joi')
const token = require('../token')

module.exports = [{
  method: 'POST',
  path: '/validate',
  options: {
    validate: {
      payload: joi.object({
        token: joi.string().required()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await token.validate(request.payload.token))
    }
  }
}]
