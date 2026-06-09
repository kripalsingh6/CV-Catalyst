import express from "express";
import User from "./models/user.js";
import authroutes from "./routes/route.auth.js";
import passport from "passport";
import LocalStrategy from "passport-local";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";

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
app.use(express.urlencoded({ extended: true })); // 

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

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
// app.use("/api/auth", authroutes);
app.use("/api", authroutes);



app.get("/api/jokes",async (req,res)=>{
    try {
    const response = await axios.get("https://icanhazdadjoke.com/", {
      headers: {
        Accept: "application/json"
      }
    });

    res.json([
      {
        id: response.data.id,
        joke: response.data.joke
      }
    ]);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch joke" });
  }
    
})

app.get("/api/intro",(req,res)=>{
  res.json({
    message: "hello my dear friend",
  })
})



app.listen(port, () => {
  console.log(`Server is running on ${port}`);
})