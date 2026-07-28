import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Database Connected (Cloud Atlas)");
  } catch (err) {
    console.log("⚠️ Primary DB Connection Error:", err.message);
    console.log("🔄 Attempting fallback to local MongoDB...");
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/cv-catalyst", {
        serverSelectionTimeoutMS: 3000,
      });
      console.log("✅ Database Connected (Local MongoDB)");
    } catch (localErr) {
      console.log("⚠️ Local DB Error:", localErr.message);
      console.log("🚀 Server running in disconnected mode. Reconnect network to sync Atlas.");
    }
  }
};