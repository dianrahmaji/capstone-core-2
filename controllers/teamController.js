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

// @desc Get All Team
// @route GET /api/team
// @access Private/Admin
const getTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find({})
  res.status(200).json(teams)
})

// @desc Get Team by Id
// @route GET /api/team/:id
// @access Private/User
const getTeamById = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id)

  if (!team) {
    res.status(404)
    throw new Error('Team not found')
  }

  res.status(200).json(team)
})

// @desc Update Team
// @route PUT /api/team/:id
// @access Private/User
const updateTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id)
  const { name } = req.body

  if (!team) {
    res.status(404)
    throw new Error('Team not found')
  }

  team.name = name
  const updatedTeam = team.save()

  res.status(204).json(updatedTeam)
})

// @desc Add Member to Team
// @route PUT /api/team/:id/add
// @access Private/User
const addMember = asyncHandler(async (req, res) => {
  const userId = req.body.userId

  const team = await Team.findByIdAndUpdate(req.params.id, {
    $push: {
      members: userId
    }
  })

  res.status(201).json(team)
})

export { createTeam, approveTeam, getTeamById, getTeams, updateTeam, addMember }
