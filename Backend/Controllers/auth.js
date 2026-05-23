import User from '../model/user.js';

//get /api/auth/signup

// export const RenderSignup = async(req, res)=>{
//    res.status(200).json({
//      message: "signup successfully",
//    })
// }
// post /api/auth/signup

export const Showsignup = async(req , res, next)=>{
     try{
        let {name , password , email} = req.body;
           if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
       }
         let existing = await User.findOne({email});

         if(existing){
            res.status(409).json({
                message:" User already register",
            });
        }

        const newUser = new User({name , email});
        const registerUser = await User.register(newUser , password);
        req.login(registerUser, (error)=>{
            if(error){
                return next(error);
            }

              return res.status(201).json({
              message: "Signup successful",
                user: registeredUser,
      });
        });
    
    }catch(error){
         return res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
    }
};

// post api/auth/login

export const login = async(req,res)=>{
     res.status(200).json({
        message : "login successfully",
          user: req.user,
     })
}



