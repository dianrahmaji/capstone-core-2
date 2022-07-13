import asyncHandler from 'express-async-handler'
import Repository from '../models/repositoryModel.js'
import Team from '../models/teamModel.js'

// @desc Create Team
// @route POST /api/team
// @access Private/User
const createTeam = asyncHandler(async (req, res) => {
  const { teamName: name, ...data } = req.body

  const team = await Team.create({ name })

  const repository = await Repository.create(data)

  team.repository = repository
  await team.save()

  res.status(201).json(repository)
})

// @desc Approve Team
// @route PUT /api/team/:id/approve
// @access Private/Admin
const approveTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id)

  if (!team) {
    res.status(404)
    throw new Error('Team not found')
  }

  team.isApproved = true
  const approvedTeam = team.save()
  res.status(200).json(approvedTeam)
})

export { createTeam, approveTeam }
