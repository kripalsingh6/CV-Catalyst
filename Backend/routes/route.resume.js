import express from "express";
import {
  createResume,
  getResumes,
  getResumeById,
  rewriteResumeController,
  deleteResume,
} from "../Controllers/controller.resume.js";
import auth from "../middleware/middleware.auth.js";

const router = express.Router();

router.use(auth);

router.post("/", createResume);
router.get("/", getResumes);
router.get("/:id", getResumeById);
router.post("/:id/rewrite", rewriteResumeController);
router.delete("/:id", deleteResume);

export default router;
