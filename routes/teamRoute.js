import express from 'express'
import {
  addMember,
  createTeam,
  approveTeam,
  getTeamById,
  getTeams,
  updateTeam,
  deleteTeam
} from '../controllers/teamController.js'
import { admin, protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, createTeam).get(protect, admin, getTeams)
router
  .route('/:id')
  .get(protect, getTeamById)
  .put(protect, updateTeam)
  .delete(protect, deleteTeam)
router.route('/:id/add').put(protect, addMember)
router.route('/:id/approve').put(protect, admin, approveTeam)

export default router
