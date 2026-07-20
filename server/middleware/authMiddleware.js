const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getDbMode } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'expensetracker_secret_jwt_token_key_2026');

      const { isInMemory, inMemoryStore } = getDbMode();

      if (isInMemory) {
        const foundUser = inMemoryStore.users.find((u) => u._id === decoded.id);
        if (!foundUser) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        const { password, ...userWithoutPassword } = foundUser;
        req.user = userWithoutPassword;
      } else {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }
      }

      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
