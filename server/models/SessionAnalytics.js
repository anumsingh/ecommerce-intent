const mongoose = require('mongoose');

const sessionAnalyticsSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  userEmail: {
    type: String,
    default: 'guest@ecom.local',
  },
  intentScore: {
    type: Number,
    default: 0,
  },
  intentLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
  },
  probability: {
    type: Number,
    default: 0,
  },
  eventCount: {
    type: Number,
    default: 0,
  },
  events: [
    {
      eventType: String,
      itemId: Number,
      itemName: String,
      price: Number,
      platform: String,
      timestamp: Number,
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.models.SessionAnalytics || mongoose.model('SessionAnalytics', sessionAnalyticsSchema);
