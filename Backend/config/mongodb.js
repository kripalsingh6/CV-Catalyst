import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.DB_URL)
.then(()=>{
    console.log("Database Connected");
})
.catch((error)=>{
    console.log("Database Connection error" , error.message);
});