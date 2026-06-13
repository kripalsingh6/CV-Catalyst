import mongoose from "mongoose";
import pkg from "passport-local-mongoose";

const passportLocalMongoose = pkg.default || pkg;

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    subscription: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },
    resumeCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ✅ FIXED (now always a function)
UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

export default mongoose.model("User", UserSchema);