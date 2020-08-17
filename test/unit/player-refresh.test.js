
const db = require('../../app/data/models')
jest.mock('../../app/data/models')
const refresh = require('../../app/league/player-refresh')

const players = [{
  firstName: 'Ian',
  lastName: 'Henderson',
  position: 'FWD',
  team: 'Rochdale'
}, {
  firstName: 'Adebayo',
  lastName: 'Akinfenwa',
  position: 'FWD',
  team: 'Wycombe'
}]

describe('refreshing player list', () => {
  test('should return success if list valid', async () => {
    db.Team.findOne.mockResolvedValue(1)

    const result = await refresh(players)

    expect(result.success).toBeTruthy()
    expect(result.unmappedPlayers).toBeUndefined()
  })

  test('should return failure if all teams invalid', async () => {
    db.Team.findOne.mockResolvedValue(null)

    const result = await refresh(players)

    expect(result.success).toBeFalsy()
    expect(result.unmappedPlayers.length).toBe(2)
  })

  test('should return failure if some teams invalid', async () => {
    db.Team.findOne.mockResolvedValue(null)
      .mockResolvedValueOnce(1)

    const result = await refresh(players)

    expect(result.success).toBeFalsy()
    expect(result.unmappedPlayers.length).toBe(1)
  })

  test('should not refresh partial list invalid', async () => {
    db.Team.findOne.mockResolvedValue(null)
      .mockResolvedValueOnce(1)

    await refresh(players)

    expect(db.Player.truncate.mock.calls.length).toBe(0)
    expect(db.Player.bulkCreate.mock.calls.length).toBe(0)
  })

  test('should return failure if position invalid', async () => {
    db.Team.findOne.mockResolvedValue(null)

    const result = await refresh([{
      firstName: 'Ian',
      lastName: 'Henderson',
      position: 'ST',
      team: 'Rochdale'
    }])

    expect(result.success).toBeFalsy()
    expect(result.unmappedPlayers.length).toBe(1)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
  afterAll(() => {
    jest.resetAllMocks()
  })
})
