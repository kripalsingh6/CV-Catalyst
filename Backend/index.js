import express from "express";
import mongoose from "mongoose";
import User from "./models/user.js";
import authroutes from "./routes/route.auth.js";
import authPayment from "./routes/route.payment.js";
import jdRoutes from "./routes/route.jd.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import resumeRoutes from "./routes/route.resume.js";
import passport from "passport";
import LocalStrategy from "passport-local";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/mongodb.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Passport Strategy Configuration
passport.use(
  new LocalStrategy({ usernameField: "email" }, User.authenticate())
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const startServer = async () => {
  await connectDB();

  // Initialize Session Store after Database Connection resolves
  const sessionStore = mongoose.connection.readyState === 1
    ? MongoStore.create({
        client: mongoose.connection.getClient(),
        touchAfter: 24 * 3600,
      })
    : undefined;

  app.use(
    session({
      name: "cvcatalyst.sid",
      secret: process.env.SECRET_SESSION || "secret_key",
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Routes
  app.get("/api/home", (req, res) => {
    res.send("welcome to home");
  });

  app.use("/api/auth", authroutes);
  app.use("/api/payment", authPayment);
  app.use("/api/jd", jdRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/resume", resumeRoutes);

  app.listen(port, () => {
    console.log(`🚀 Server running on ${port}`);
  });
};

startServer();