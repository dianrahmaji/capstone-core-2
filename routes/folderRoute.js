import express from 'express'
import {
  createFolder,
  getAllChildrenById
} from '../controllers/folderController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, createFolder)
router.route('/id').get(protect, getAllChildrenById)
