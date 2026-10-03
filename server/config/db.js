const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecom_intent_db';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${uri}. Falling back to in-memory mode for offline resilience.`);
    console.warn(`[MongoDB Info] Provide a valid MONGO_URI in .env or start MongoDB locally (e.g. MongoDB Community Server / MongoDB Atlas).`);
    return false;
  }
};

module.exports = connectDB;
