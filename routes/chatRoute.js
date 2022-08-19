import express from 'express'
import { getAllMessages, sendMessage } from '../controllers/chatController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/:id').get(protect, getAllMessages).post(protect, sendMessage)

export default router
