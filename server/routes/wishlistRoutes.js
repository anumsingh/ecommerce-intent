const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Wishlist = require('../models/Wishlist');

const isMongoConnected = () => mongoose.connection.readyState === 1;

// In-memory fallback
let fallbackWishlist = [];

// GET /api/wishlist
router.get('/', async (req, res) => {
  const email = req.query.email || req.user?.email || 'guest@ecom.local';
  try {
    if (isMongoConnected()) {
      const items = await Wishlist.find({ userEmail: email }).sort({ createdAt: -1 });
      return res.json({ status: 'success', items });
    }
    const items = fallbackWishlist.filter(w => w.userEmail === email);
    return res.json({ status: 'success', items });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve wishlist' });
  }
});

// POST /api/wishlist
router.post('/', async (req, res) => {
  const { userEmail, productTitle, productLink, price, rating, reviews, image, platform } = req.body;
  const email = userEmail || req.user?.email || 'guest@ecom.local';

  if (!productTitle || !price) {
    return res.status(400).json({ status: 'error', message: 'Product title and price are required' });
  }

  const wishlistItem = {
    userEmail: email,
    productTitle,
    productLink: productLink || '',
    price: parseFloat(price) || 0,
    rating: parseFloat(rating) || 0,
    reviews: parseInt(reviews) || 0,
    image: image || '',
    platform: platform || 'other',
    createdAt: new Date()
  };

  try {
    if (isMongoConnected()) {
      // Check if already in wishlist
      const existing = await Wishlist.findOne({ userEmail: email, productLink: wishlistItem.productLink });
      if (existing) {
        return res.json({ status: 'already_saved', message: 'Item is already in your wishlist', item: existing });
      }
      const saved = await Wishlist.create(wishlistItem);
      return res.status(201).json({ status: 'success', message: 'Added to wishlist!', item: saved });
    } else {
      const exists = fallbackWishlist.some(w => w.userEmail === email && w.productLink === wishlistItem.productLink);
      if (exists) {
        return res.json({ status: 'already_saved', message: 'Item is already in your wishlist', item: wishlistItem });
      }
      fallbackWishlist.push(wishlistItem);
      return res.status(201).json({ status: 'success', message: 'Added to wishlist!', item: wishlistItem });
    }
  } catch (error) {
    console.error('Wishlist error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to save to wishlist' });
  }
});

// DELETE /api/wishlist/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected() && mongoose.isValidObjectId(id)) {
      await Wishlist.findByIdAndDelete(id);
    } else {
      fallbackWishlist = fallbackWishlist.filter(w => (w._id && w._id.toString() !== id) && (w.productLink !== id));
    }
    return res.json({ status: 'success', message: 'Item removed from wishlist' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to delete item' });
  }
});

module.exports = router;
