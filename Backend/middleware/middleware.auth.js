
export const savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl; 
  }
  next();
};

export const auth = (req, res, next) => {
  try {
    // Passport adds this method
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({
        message: "Unauthorized: Please login",
      });
    }

    // user is already attached by passport
    next();
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

