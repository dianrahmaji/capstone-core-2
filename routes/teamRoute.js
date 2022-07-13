import express from 'express'
import { createTeam, approveTeam } from '../controllers/teamController.js'
import { admin, protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, createTeam)
router.route('/:id/approve').put(protect, admin, approveTeam)

export default router
