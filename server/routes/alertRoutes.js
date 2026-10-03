const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Alert = require('../models/Alert');
const nodemailer = require('nodemailer');

const isMongoConnected = () => mongoose.connection.readyState === 1;

// In-memory fallback
const fallbackAlerts = [];

// Transporter for price drop alerts
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.MAIL_USER || '',
    pass: process.env.MAIL_PASS || ''
  }
});

// GET /api/alerts
router.get('/', async (req, res) => {
  const email = req.query.email || req.user?.email;
  try {
    if (isMongoConnected() && email) {
      const alerts = await Alert.find({ email }).sort({ createdAt: -1 });
      return res.json({ status: 'success', alerts });
    } else if (email) {
      const alerts = fallbackAlerts.filter(a => a.email === email);
      return res.json({ status: 'success', alerts });
    }
    return res.json({ status: 'success', alerts: fallbackAlerts });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve alerts' });
  }
});

// POST /api/alerts
router.post('/', async (req, res) => {
  const { email, product_link, product_title, target_price, current_price, platform } = req.body;

  if (!email || !product_link || !target_price) {
    return res.status(400).json({ status: 'error', message: 'Email, product link, and target price are required' });
  }

  const alertData = {
    email: email.toLowerCase().trim(),
    productTitle: product_title || 'Product Tracker',
    productLink: product_link,
    targetPrice: parseFloat(target_price),
    currentPrice: parseFloat(current_price) || 0,
    platform: platform || 'amazon',
    active: true,
    createdAt: new Date()
  };

  try {
    if (isMongoConnected()) {
      const createdAlert = await Alert.create(alertData);
      return res.status(201).json({
        status: 'success',
        message: 'Price drop alert created successfully! We will notify you when price drops.',
        alert: createdAlert
      });
    } else {
      fallbackAlerts.push(alertData);
      return res.status(201).json({
        status: 'success',
        message: 'Price drop alert created successfully! (Offline mode)',
        alert: alertData
      });
    }
  } catch (error) {
    console.error('Alert creation error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create price alert' });
  }
});

module.exports = router;
