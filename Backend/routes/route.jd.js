import { Router } from "express";
import auth from "../middleware/middleware.auth.js";
<<<<<<< HEAD
import { analyzeJD } from "../controllers/jd.controller.js";
=======
import { analyzeJD } from "../Controllers/jd.controller.js";
>>>>>>> b0593b4 (some change)
const router = Router();
router.use(auth);
router.post("/:resumeId/analyze", analyzeJD);
export default router;