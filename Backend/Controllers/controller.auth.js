import User from '../models/user.js';

// SIGNUP
export const signup = async (req, res, next) => {
  try {
    let { name, password, email } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({
        message: "User already registered",
      });
    }

    const newUser = new User({ name, email });
    const registerUser = await User.register(newUser, password);

    req.login(registerUser, (error) => {
      if (error) return next(error);

      return res.status(201).json({
        message: "Signup successful",
        user: registerUser,
      });
    });

  } catch (error) {
    return res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
};

// LOGIN
export const login = (req, res) => {
  res.status(200).json({
    message: "Login successful",
    user: req.user,
  });
};

// GET ME
export const getme = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    plan: req.user.subscription, 
    resumeCount: req.user.resumeCount,
    createdAt: req.user.createdAt,
  });
};

// LOGOUT
export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      return res.status(200).json({
        message: "Logout successful",
      });
    });
  });
};