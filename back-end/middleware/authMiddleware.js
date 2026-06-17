const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Token extract cheyyatam (Bearer xxxxx -> xxxxx)
      token = req.headers.authorization.split(' ')[1];

      // Token verify cheyyatam
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // User find chesi req lo pettatam (password ledhu)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};