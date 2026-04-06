const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const path = require('path');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');
const uploadRoutes = require('./routes/upload');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173', // Vite default
  'https://shopg-backend.onrender.com',
].filter(Boolean);

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// ─── Static files (Production) ───────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'shopg-frontend/build')));

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'ShopG API is live!', docs: '/api/health' });
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ShopG backend running ✅' });
});

// ─── Catch-all for SPA ───────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'shopg-frontend/build', 'index.html'));
});

// ─── Global error handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── DB + Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shopg';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
