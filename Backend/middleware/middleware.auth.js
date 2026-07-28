// middleware/middleware.auth.js

export const savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl;
  }
  next();
};

const auth = (req, res, next) => {
  try {
    if ((req.isAuthenticated && req.isAuthenticated()) || req.user) {
      return next();
    }

    return res.status(401).json({
      success: false,
      message: "Unauthorized: Please login",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default auth; // ✅ important

