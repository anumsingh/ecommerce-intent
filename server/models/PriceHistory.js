const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  productTitle: {
    type: String,
    required: true,
  },
  productLink: {
    type: String,
    required: true,
    index: true,
  },
  price: {
    type: Number,
    required: true,
  },
  website: {
    type: String,
    enum: ['amazon', 'myntra', 'ajio', 'other'],
    default: 'other',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.models.PriceHistory || mongoose.model('PriceHistory', priceHistorySchema);
