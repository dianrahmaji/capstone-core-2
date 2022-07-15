import express from 'express'
import {
  createDocument,
  getDocumentById
} from '../controllers/documentController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, createDocument)
router.route('/:id').get(protect, getDocumentById)
