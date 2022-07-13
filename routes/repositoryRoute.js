import express from 'express'
import { createRepository } from '../controllers/repositoryController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, createRepository)

export default router
