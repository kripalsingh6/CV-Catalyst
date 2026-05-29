import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

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

// 🔥 FIX HERE
UserSchema.plugin(passportLocalMongoose.default, {
  usernameField: "email",
});

const User = mongoose.model("User", UserSchema);
export default User;