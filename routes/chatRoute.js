import express from "express";
import { getAllMessages } from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/:id").get(protect, getAllMessages);

export default router;
