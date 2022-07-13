import express from 'express'
import {
  createTeam,
  approveTeam,
  getTeamById,
  getTeams
} from '../controllers/teamController.js'
import { admin, protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, createTeam).get(protect, admin, getTeams)
router.route('/:id').get(protect, getTeamById)
router.route('/:id/approve').put(protect, admin, approveTeam)

export default router
