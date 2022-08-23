import express from "express";

import {
  getNotificationById,
  resetNotificationById,
} from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/:roomId/member/:memberId")
  .get(protect, getNotificationById)
  .put(protect, resetNotificationById);

export default router;
