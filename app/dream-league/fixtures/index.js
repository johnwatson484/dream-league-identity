const db = require('../../data/models')

async function getManagerCupWeeks () {
  const managers = await db.Manager.findAll()
  const fixtures = await db.Fixture.findAll()
  const managerCupWeeks = []

  managers.forEach(manager => {
    fixtures.forEach(fixture => {
      if (fixture.homeManagerId === manager.managerId || fixture.awayManagerId === manager.managerId) {
        managerCupWeeks.push({ managerId: manager.managerId, fixtureId: fixture.fixtureId })
      }
    })
  })

  return managerCupWeeks
}

module.exports = {
  getManagerCupWeeks
}
