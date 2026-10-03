require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const intentRoutes = require('./routes/intentRoutes');
const alertRoutes = require('./routes/alertRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const { authMiddleware } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);

// Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    server: 'E-Commerce MERN Express Backend',
    time: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/intent', intentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`[Express Server] Running on http://127.0.0.1:${PORT}`);
  console.log(`[ML Service URL] Connected to ${process.env.ML_SERVICE_URL || 'http://127.0.0.1:5001'}`);
  console.log('='.repeat(60));
});
