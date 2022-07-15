import express from 'express'
import { createDocument } from '../controllers/documentController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, createDocument)
