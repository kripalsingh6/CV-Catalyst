import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim:true,
         unique: true,
      lowercase: true,
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    subscription:{
        type:String,
         enum: ["free", "pro"],
    },
    resumeCount: {
      type: Number,
      default: 0,
    },
},
{  timestamps:true});

UserSchema.pre("save", async()=>{
   if(!this.isModified("password"))return;
   this.password = await bcrypt.hash(this.password, 10);
})


UserSchema.methods.comparePassword = async function (userPass) {
  return await bcrypt.compare(userPass, this.password);
};

const User = mongoose.model("User",UserSchema);