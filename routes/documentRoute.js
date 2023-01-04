import express from "express";
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  updateDocument,
  getDocumentByString,
} from "../controllers/documentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createDocument);
router.route("/search").get(getDocumentByString);
router.route("/search/:id").get(getDocumentById);
router
  .route("/:id")
  .get(protect, getDocumentById)
  .delete(protect, deleteDocument)
  .put(protect, updateDocument);

export default router;
