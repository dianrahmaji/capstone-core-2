import asyncHandler from 'express-async-handler'
import Chat from '../models/chatModel.js'
import Repository from '../models/repositoryModel.js'
import Team from '../models/teamModel.js'
import User from '../models/userModel.js'

// @desc Create Team
// @route POST /api/team
// @access Private/User
const createTeam = asyncHandler(async (req, res) => {
  const { name, administrator, ...data } = req.body

  const team = await Team.create({ name, administrator })

  const repository = await Repository.create(data)
  const chat = await Chat.create({})

  team.repository = repository
  team.chat = chat
  await team.save()

  await User.findByIdAndUpdate(administrator, {
    $push: {
      teams: team._id
    }
  })

  res.status(201).json(repository)
})

/**
 * @desc Approve/Reject Team
 * @route PUT /api/team/:id?/approve?value={approve}
 * @access Private/Admin
 */
const approveTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id)
  const approval = req.query.value === 'true' ? 'accepted' : 'rejected'

  if (!team) {
    res.status(404)
    throw new Error('Team not found')
  }

  team.status = approval
  const approvedTeam = team.save()
  res.status(200).json(approvedTeam)
})

// @desc Get All Team
// @route GET /api/team
// @access Private/Admin
const getTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find({})
    .select(['administrator', 'members', 'name', 'status'])
    .populate({
      path: 'repository',
      select: ['description', 'startDate', 'endDate', 'title']
    })
  res.status(200).json(teams)
})

// @desc Get Team by Id
// @route GET /api/team/:id
// @access Private/User
const getTeamById = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id)
    .populate({
      path: 'repository',
      select: ['description', 'startDate', 'endDate', 'title']
    })
    .populate({
      path: 'administrator',
      select: ['fullName', 'faculty', 'accountType']
    })
    .populate({
      path: 'members',
      select: ['fullName', 'faculty', 'accountType']
    })

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
  const repository = await Repository.findById(team.repository)
  const { name, title, description, startDate, endDate } = req.body

  if (!team) {
    res.status(404)
    throw new Error('Team not found')
  }

  team.name = name
  if (team.status === 'rejected') {
    team.status = 'updated'
  }

  repository.title = title
  repository.description = description
  repository.startDate = startDate
  repository.endDate = endDate

  const [updatedTeam, updatedRepository] = await Promise.all([
    team.save(),
    repository.save()
  ])

  res.status(204).json({
    name: updatedTeam.name,
    status: updatedTeam.status,
    description: updatedRepository.description,
    startDate: updatedRepository.startDate,
    endDate: updatedRepository.endDate
  })
})

// @desc Add Member to Team
// @route PUT /api/team/:id/member
// @access Private/User
const addMember = asyncHandler(async (req, res) => {
  const team = await Team.findByIdAndUpdate(req.params.teamId, {
    $push: {
      members: req.params.userId
    }
  })

  res.status(201).json(team)
})

/**
 * @desc Delete Member from Team
 * @route DELETE /api/team/:teamId/member/:memberId
 * @access Private/User
 */
const deleteMember = asyncHandler(async (req, res) => {
  await Team.findByIdAndUpdate(req.params.teamId, {
    $pull: {
      members: req.params.memberId
    }
  })

  res.status(204).json({ message: 'Member deleted successfully' })
})

/**
 * @desc Delete Team by Id
 * @route DELETE /api/team/:id
 * @access Private/User
 */
const deleteTeam = asyncHandler(async (req, res) => {
  const team = await Team.findByIdAndDelete(req.params.id)
  Repository.findByIdAndDelete(team.repository._id)

  res.status(204).json({ message: 'team deleted successfully' })
})

export {
  createTeam,
  approveTeam,
  getTeamById,
  getTeams,
  updateTeam,
  addMember,
  deleteMember,
  deleteTeam
}
