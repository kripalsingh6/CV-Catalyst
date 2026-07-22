import express from 'express';
const router = express.Router();
import passport from 'passport';

import { signup, login, logout, getme } 
from '../Controllers/controller.auth.js';

import auth, { savedRedirectUrl } 
from "../middleware/middleware.auth.js";

router.post("/signup", signup);

router.post(
  "/login",
  savedRedirectUrl,
   login
);

router.post("/logout", logout);
router.get("/getme", auth, getme);

export default router;