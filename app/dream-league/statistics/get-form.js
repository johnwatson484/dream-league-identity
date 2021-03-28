const db = require('../../data/models')
const getPoints = require('../results/get-points')
const sortArray = require('../../utils/sort-array')
const weeksToInclude = 6

async function getForm () {
  const managers = await db.Manager.findAll({ raw: true })
  let summaries = await db.Summary.findAll({ raw: true, order: [['gameweekId', 'DESC']], limit: weeksToInclude })
  summaries = summaries.reverse()
  const form = []
  managers.forEach(manager => {
    let points = 0
    let results = ''
    summaries.forEach(gameweek => {
      const result = gameweek.summary.scores.find(x => x.managerId === manager.managerId)?.result || 'X'
      points += getPoints(result)
      results += result
    })
    form.push({
      managerId: manager.managerId,
      manager: manager.name,
      points,
      results
    })
  })
  return orderForm(form)
}

function orderForm (form) {
  return form.sort((a, b) => { return sortArray(b.points, a.points) || sortArray(a.manager, b.manager) })
    .map((x, i) => ({ position: i + 1, ...x }))
}

module.exports = getForm