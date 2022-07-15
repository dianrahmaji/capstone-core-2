import express from 'express'
import {
  createDocument,
  deleteDocument,
  getDocumentById
} from '../controllers/documentController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, createDocument)
router
  .route('/:id')
  .get(protect, getDocumentById)
  .delete(protect, deleteDocument)

export default router
