import { Router } from "express";
import auth from "../middleware/middleware.auth.js";
import { analyzeJD } from "../Controllers/jd.controller.js";

const router = Router();
router.use(auth);
router.post("/:resumeId/analyze", analyzeJD);

export default router;