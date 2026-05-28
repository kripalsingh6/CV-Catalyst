import express from 'express';
import User from './models/user.js'
const app = express();

const port = process.env.PORT || 3000;

import axios from 'axios';

import cors from 'cors';
app.use(cors(
  {
    origin:[
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    credentials:true,
  }
));

import dotenv from "dotenv";
dotenv.config();

import session from 'express-session';
app.use(session({
  secret:process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly:true,
    secure: false,
    expires:Date.now()+ 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
  }
}));

import passport from 'passport';
import LocalStrategy from 'passport-local';
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());









app.get("/", (req, res) => {
    res.send("hello")//
});
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