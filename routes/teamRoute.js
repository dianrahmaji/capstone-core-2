import express from "express";
import {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  approveTeam,
  addMember,
  updateMember,
  deleteMember,
  getRepositoryByString,
  getRepositoryById,
  respondTeam,
} from "../controllers/teamController.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createTeam).get(protect, admin, getTeams);
router.route("/repository/").get(getRepositoryByString);
router.route("/repository/:id").get(getRepositoryById);
router
  .route("/:id")
  .get(protect, getTeamById)
  .put(protect, updateTeam)
  .delete(protect, deleteTeam);
router
  .route("/:teamId/member/:memberId")
  .post(protect, addMember)
  .put(protect, updateMember)
  .delete(protect, deleteMember);
router.route("/:id/approve").put(protect, admin, approveTeam);
router.route("/:id/respond").put(protect, admin, respondTeam);

export default router;
