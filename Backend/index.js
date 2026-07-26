import express from "express";
import User from "./models/user.js";
import authroutes from "./routes/route.auth.js";
import authPayment from "./routes/route.payment.js";
<<<<<<< HEAD
=======
import jdRoutes from "./routes/route.jd.js";
import uploadRoutes from "./routes/uploadRoutes.js";
>>>>>>> b0593b4 (some change)
import passport from "passport";
import LocalStrategy from "passport-local";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
<<<<<<< HEAD
import axios from "axios";
import { connectDB } from "./config/mongodb.js";
import cookieParser from "cookie-parser";

import jdRoutes from "./routes/route.jd.js";



dotenv.config(); // 

const app = express();
const port = process.env.PORT || 3000;

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "http://localhost:5174"]
      ,
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());


// Session
app.use(
  session({
    name: "connect.sid", // optional
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false, // 
    cookie: {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

=======
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

// Session
app.use(
  session({
    name: "connect.sid",
    secret: process.env.SECRET_SESSION || "secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

>>>>>>> b0593b4 (some change)
// Passport
app.use(passport.initialize());
app.use(passport.session());

<<<<<<< HEAD
passport.use(new LocalStrategy(
   { usernameField: "email" },
   User.authenticate()));
=======
passport.use(
  new LocalStrategy({ usernameField: "email" }, User.authenticate())
);
>>>>>>> b0593b4 (some change)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
<<<<<<< HEAD
app.get("/api/home",(req,res)=>{
  res.send("welcome to home")
})
app.use("/api/auth", authroutes);
// app.use("/api/payment", authPayment);
app.use("/api/jd", jdRoutes);




// app.get("/api/jokes",async (req,res)=>{
//     try {
//     const response = await axios.get("https://icanhazdadjoke.com/", {
//       headers: {
//         Accept: "application/json"
//       }
//     });

//     res.json([
//       {
//         id: response.data.id,
//         joke: response.data.joke
//       }
//     ]);

//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch joke" });
//   }
    
// })

// app.get("/api/intro",(req,res)=>{
//   res.json({
//     message: "hello my dear friend",
//   })
// })



const startServer = async () => {
  await connectDB();  

  app.listen(port, () => {
    console.log(`🚀 Server running on ${port}`);
  });
};

=======
app.get("/api/home", (req, res) => {
  res.send("welcome to home");
});

app.use("/api/auth", authroutes);
app.use("/api/payment", authPayment);
app.use("/api/jd", jdRoutes);
app.use("/api/upload", uploadRoutes);

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`🚀 Server running on ${port}`);
  });
};

>>>>>>> b0593b4 (some change)
startServer();