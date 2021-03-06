const db = require('../../data/models')
const joi = require('joi')
const boom = require('@hapi/boom')

module.exports = [{
  method: 'GET',
  path: '/dream-league/history',
  options: {
    handler: async (request, h) => {
      if (request.query.historyId) {
        return h.response(await db.History.findOne({ where: { historyId: request.query.historyId } }))
      }
      return h.response(await db.History.findAll({ order: [['year', 'DESC']] }))
    }
  }
}, {
  method: 'POST',
  path: '/dream-league/history/create',
  options: {
    validate: {
      payload: joi.object({
        year: joi.number().required(),
        teams: joi.number(),
        league1: joi.string().allow(''),
        league2: joi.string().allow(''),
        cup: joi.string().allow(''),
        leagueCup: joi.string().allow(''),
        plate: joi.string().allow('')
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.History.create(request.payload))
    }
  }
}, {
  method: 'POST',
  path: '/dream-league/history/edit',
  options: {
    validate: {
      payload: joi.object({
        historyId: joi.number(),
        year: joi.number().required(),
        teams: joi.number(),
        league1: joi.string().allow(''),
        league2: joi.string().allow(''),
        cup: joi.string().allow(''),
        leagueCup: joi.string().allow(''),
        plate: joi.string().allow('')
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.History.upsert(request.payload))
    }
  }
}, {
  method: 'POST',
  path: '/dream-league/history/delete',
  options: {
    validate: {
      payload: joi.object({
        historyId: joi.number()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.History.destroy({ where: { historyId: request.payload.historyId } }))
    }
  }
}]
