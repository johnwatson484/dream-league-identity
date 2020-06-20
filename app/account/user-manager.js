const db = require('../data/models')
const addUserToRole = require('./role-manager')
const bcrypt = require('bcrypt')

async function userExists (email) {
  if (await getUser(email) !== null) {
    console.log(await getUser(email))
    return true
  }
  return false
}

async function getUser (email) {
  return db.user.findOne({
    where: { email },
    raw: true,
    nest: true,
    include: [{
      model: db.role,
      as: 'roles',
      attributes: ['name'],
      through: { attributes: [] }
    }]
  })
}

async function createUser (email, password) {
  const passwordHash = await bcrypt.hash(password, 10)

  const user = await db.user.create({
    email,
    passwordHash
  })

  await addUserToRole(user.userId, 'user')
  return getUser(email)
}

module.exports = {
  userExists,
  getUser,
  createUser
}
