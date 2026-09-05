import express from 'express';
import passport from 'passport';
const router = express.Router();

import { signup, login, logout, getme } 
from '../Controllers/controller.auth.js';

import auth, { savedRedirectUrl } 
from "../middleware/middleware.auth.js";

const CLIENT_URL = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");


// --- Google OAuth Routes ---
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_URL}/login?error=oauth_failed`,
  }),
  (req, res) => {
    // Successfully logged in via session
    res.redirect(`${CLIENT_URL}/dashboard`);
  }
);

// --- GitHub OAuth Routes ---
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${CLIENT_URL}/login?error=oauth_failed`,
  }),
  (req, res) => {
    // Successfully logged in via session
    res.redirect(`${CLIENT_URL}/dashboard`);
  }
);

// Local Authentication Routes
router.post("/signup", signup);

router.post(
  "/login",
  savedRedirectUrl,
   login
);

router.post("/logout", logout);
router.get("/getme", auth, getme);

export default router;