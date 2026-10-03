const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  productTitle: {
    type: String,
    required: true,
  },
  productLink: {
    type: String,
    required: true,
  },
  targetPrice: {
    type: Number,
    required: true,
  },
  currentPrice: {
    type: Number,
  },
  platform: {
    type: String,
    default: 'amazon',
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.models.Alert || mongoose.model('Alert', alertSchema);
