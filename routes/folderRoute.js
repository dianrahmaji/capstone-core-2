import express from 'express'
import { createFolder } from '../controllers/folderController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, createFolder)
