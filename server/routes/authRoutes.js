const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { JWT_SECRET, requireAuth } = require('../middleware/auth');

// In-memory fallback if MongoDB Atlas is momentarily disconnected
const fallbackUsers = new Map();

// Helper to check MongoDB connection status
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Helper to validate email format
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// 1. POST /api/auth/register - Create New Account
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Field validations
    if (!name || !name.trim()) {
      return res.status(400).json({ status: 'error', message: 'Full name is required.' });
    }
    if (name.trim().length < 2) {
      return res.status(400).json({ status: 'error', message: 'Name must be at least 2 characters long.' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ status: 'error', message: 'Email address is required.' });
    }
    const normalizedEmail = email.toLowerCase().trim();
    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ status: 'error', message: 'Please enter a valid email address.' });
    }

    if (!password) {
      return res.status(400).json({ status: 'error', message: 'Password is required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ status: 'error', message: 'Password must be at least 6 characters long.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (isMongoConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({
          status: 'already_exists',
          message: 'An account already exists with this email. Please sign in instead.'
        });
      }

      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      });

      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        status: 'success',
        message: 'Account created successfully on MongoDB Atlas!',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } else {
      // Memory fallback mode
      if (fallbackUsers.has(normalizedEmail)) {
        return res.status(400).json({
          status: 'already_exists',
          message: 'An account already exists with this email. Please sign in instead.'
        });
      }

      const userObj = {
        id: 'user_' + Date.now(),
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        createdAt: new Date()
      };
      fallbackUsers.set(normalizedEmail, userObj);

      const token = jwt.sign(
        { id: userObj.id, email: userObj.email, name: userObj.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        status: 'success',
        message: 'Account created successfully (Fallback mode)!',
        token,
        user: {
          id: userObj.id,
          name: userObj.name,
          email: userObj.email,
          createdAt: userObj.createdAt
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error during registration.' });
  }
});

// 2. POST /api/auth/login - Sign In
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ status: 'error', message: 'Email address is required.' });
    }
    if (!password) {
      return res.status(400).json({ status: 'error', message: 'Password is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = null;

    if (isMongoConnected()) {
      user = await User.findOne({ email: normalizedEmail });
    } else {
      user = fallbackUsers.get(normalizedEmail);
    }

    if (!user) {
      return res.status(404).json({
        status: 'not_found',
        message: 'No account found with this email. Please create an account or verify your spelling.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'invalid_credentials',
        message: 'Invalid password. Please check your password and try again.'
      });
    }

    const userId = user._id || user.id;
    const token = jwt.sign(
      { id: userId, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      status: 'success',
      message: 'Signed in successfully!',
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error during login.' });
  }
});

// 3. GET /api/auth/profile - Fetch Current User Profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const user = await User.findById(req.user.id).select('-password');
      if (user) {
        return res.json({ status: 'success', user });
      }
    }
    return res.json({ status: 'success', user: req.user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve user profile.' });
  }
});

module.exports = router;
