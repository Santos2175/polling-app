const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Middleware to authenticate the user
const authenticate = async (req, res, next) => {
  let token = req.headers?.authorization?.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    next();
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Not authorized. token failed' });
  }
};

module.exports = { authenticate };
