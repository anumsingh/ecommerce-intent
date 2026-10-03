const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
const SessionAnalytics = require('../models/SessionAnalytics');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:5001';
const isMongoConnected = () => mongoose.connection.readyState === 1;

// POST /api/intent/track
router.post('/track', async (req, res) => {
  const { event_type, item_id, item_identifier, metadata, session_id, title } = req.body;
  const sessionId = session_id || req.headers['x-session-id'] || 'guest_session';
  const userEmail = req.user?.email || 'guest@ecom.local';

  try {
    // 1. Call ML microservice for real-time inference
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/api/intent/track`, {
      session_id: sessionId,
      event_type: event_type || 'view',
      item_id: item_id || item_identifier || title || '',
      metadata: metadata || {}
    }, { timeout: 15000 });

    const intentData = mlResponse.data.intent;

    // 2. Persist/update session analytics in MongoDB
    if (isMongoConnected() && intentData) {
      try {
        const newEvent = {
          eventType: event_type || 'view',
          itemId: intentData.features?.item_count || 1,
          itemName: metadata?.title || title || '',
          price: metadata?.price || 0,
          platform: metadata?.platform || '',
          timestamp: Date.now()
        };

        await SessionAnalytics.findOneAndUpdate(
          { sessionId },
          {
            $set: {
              userEmail,
              intentScore: intentData.probability,
              intentLevel: intentData.intent_level,
              probability: intentData.probability,
              eventCount: intentData.session_events_count || 1,
              updatedAt: new Date()
            },
            $push: { events: newEvent }
          },
          { upsert: true, new: true }
        );
      } catch (dbErr) {
        console.warn('[MongoDB SessionAnalytics Warning]:', dbErr.message);
      }
    }

    return res.json({
      status: 'success',
      session_id: sessionId,
      intent: intentData
    });
  } catch (error) {
    console.error('[Intent Tracking Error]:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to record interaction or compute intent',
      error: error.message
    });
  }
});

// GET /api/intent/current
router.get('/current', async (req, res) => {
  const sessionId = req.query.session_id || req.headers['x-session-id'] || 'guest_session';

  try {
    const mlResponse = await axios.get(`${ML_SERVICE_URL}/api/intent/current`, {
      params: { session_id: sessionId },
      timeout: 10000
    });

    return res.json(mlResponse.data);
  } catch (error) {
    console.error('[Intent Current Error]:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve intent state',
      error: error.message
    });
  }
});

// POST /api/intent/reset
router.post('/reset', async (req, res) => {
  const sessionId = req.body.session_id || req.headers['x-session-id'] || 'guest_session';

  try {
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/api/intent/reset`, {
      session_id: sessionId
    }, { timeout: 10000 });

    if (isMongoConnected()) {
      await SessionAnalytics.deleteOne({ sessionId }).catch(() => {});
    }

    return res.json(mlResponse.data);
  } catch (error) {
    console.error('[Intent Reset Error]:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to reset intent session' });
  }
});

module.exports = router;
