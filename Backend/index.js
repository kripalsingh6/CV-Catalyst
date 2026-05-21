import express from 'express';
const app = express();

const port = process.env.PORT || 3000;

import cors from 'cors';
app.use(cors());

import axios from 'axios';

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



app.listen(port, () => {
  console.log(`Server is running on ${3000}`);
})