import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
<<<<<<< HEAD
    console.log("✅ Database Connected");
  } catch (err) {
    console.log("❌ DB Error:", err.message);
    process.exit(1);
=======
    console.log("✅ Database Connected (Cloud Atlas)");
  } catch (err) {
    console.log("⚠️ Primary DB Error:", err.message);
    console.log("🔄 Attempting fallback to local MongoDB...");
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/cv-catalyst");
      console.log("✅ Database Connected (Local MongoDB)");
    } catch (localErr) {
      console.log("❌ Local DB Error:", localErr.message);
      process.exit(1);
    }
>>>>>>> b0593b4 (some change)
  }
};