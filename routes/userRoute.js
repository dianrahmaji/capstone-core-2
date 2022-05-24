import express from 'express'
import {
  authUser,
  registerUser,
  getUsers,
  getUserById,
  approveUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js'
import { protect, admin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/').post(registerUser).get(protect, admin, getUsers)
router.post('/login', authUser)
router
  .route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser)
router.route('/:id/approve').put(protect, admin, approveUser)

export default router
