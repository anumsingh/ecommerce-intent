const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ecom_secret_jwt_key_2026';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
  
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
  }
};

module.exports = { authMiddleware, requireAuth, JWT_SECRET };
