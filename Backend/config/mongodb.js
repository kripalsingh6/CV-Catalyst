import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
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
  }
};