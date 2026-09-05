import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import passport from "passport";

// Database & Passport Auth configuration
import { connectDB } from "./config/mongodb.js";
import "./config/auth.config.js";

// Routes
import authroutes from "./routes/route.auth.js";
import authPayment from "./routes/route.payment.js";
import jdRoutes from "./routes/route.jd.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import resumeRoutes from "./routes/route.resume.js";

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

// Enable trust proxy for Render reverse proxy (required for secure cookies)
if (isProduction) {
  app.set("trust proxy", 1);
}

// CORS setup supporting Vercel deployments and local development
const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : null;
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  clientUrl,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        !isProduction
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const startServer = async () => {
  await connectDB();

  // Session Store connected to MongoDB
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
      proxy: isProduction,
      cookie: {
        httpOnly: true,
        secure: isProduction, // Must be true with HTTPS in production
        sameSite: isProduction ? "none" : "lax", // Cross-site cookie between Vercel & Render
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

  // Passport middleware (MUST come after session middleware)
  app.use(passport.initialize());
  app.use(passport.session());

  // Root & Healthcheck Route for Render
  app.get("/", (req, res) => {
    res.status(200).json({
      message: "🚀 CV-Catalyst Backend API is active",
      frontend: clientUrl || "https://cv-catalyst-coral.vercel.app",
      health: "/health",
    });
  });
  app.get("/health", (req, res) => res.status(200).json({ status: "ok", timestamp: new Date().toISOString() }));

  // API Routes
  app.get("/api/home", (req, res) => res.send("welcome to home"));
  app.use("/api/auth", authroutes);
  app.use("/api/payment", authPayment);
  app.use("/api/jd", jdRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/resume", resumeRoutes);

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
};

startServer();
