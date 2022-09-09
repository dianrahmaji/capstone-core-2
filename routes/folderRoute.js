import express from "express";
import {
  createFolder,
  deleteFolder,
  getFolderById,
  updateFolder,
  updateFolderNote,
} from "../controllers/folderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createFolder);
router
  .route("/:id")
  .get(protect, getFolderById)
  .put(protect, updateFolder)
  .delete(protect, deleteFolder);
router.route("/:id/note").put(protect, updateFolderNote);

export default router;
