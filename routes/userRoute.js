import express from 'express'
import {
  authUser,
  registerUser,
  getUsers,
  getUserById
} from '../controllers/userController.js'
import { protect, admin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/').post(registerUser).get(protect, admin, getUsers)
router.post('/login', authUser)
router.route('/:id').get(protect, admin, getUserById)

export default router
