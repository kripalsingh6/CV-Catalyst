import express from "express";
import upload from "../middleware/middleware.upload.js";
import {
  createResume,
  getResumes,
  getResumeById,
  rewriteResumeController,
  deleteResume,
  extractFileTextController,
  exportPDFController,
} from "../Controllers/controller.resume.js";
import auth from "../middleware/middleware.auth.js";

const router = express.Router();

router.use(auth);

router.post("/extract-text", upload.single("file"), extractFileTextController);
router.post("/", createResume);
router.get("/", getResumes);
router.get("/:id", getResumeById);
router.post("/:id/rewrite", rewriteResumeController);
router.post("/:id/export-pdf", exportPDFController);
router.get("/:id/pdf", exportPDFController);
router.delete("/:id", deleteResume);

export default router;
