import express from "express";
import {
  createFolder,
  deleteFolder,
  getAllChildrenById,
  updateFolder,
} from "../controllers/folderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createFolder);
router
  .route("/:id")
  .get(protect, getAllChildrenById)
  .put(protect, updateFolder)
  .delete(protect, deleteFolder);

export default router;
