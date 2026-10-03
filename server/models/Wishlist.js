const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    index: true,
  },
  productTitle: {
    type: String,
    required: true,
  },
  productLink: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: '',
  },
  platform: {
    type: String,
    enum: ['amazon', 'myntra', 'ajio', 'other'],
    default: 'other',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);
