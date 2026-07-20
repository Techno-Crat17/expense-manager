const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB Database (with fallback)
connectDB();

const app = express();

// Global Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/bank', require('./routes/bankRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/stocks', require('./routes/stockRoutes'));
app.use('/api/assets', require('./routes/assetRoutes'));

const mongoose = require('mongoose');

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStates = { 0: 'Disconnected', 1: 'Connected to MongoDB Cloud', 2: 'Connecting', 3: 'Disconnecting' };
  const currentState = dbStates[mongoose.connection.readyState] || 'Unknown';

  res.status(200).json({
    status: 'success',
    database: {
      status: currentState,
      host: mongoose.connection.host || 'File Backup DB',
      name: mongoose.connection.name || 'expense_db',
    },
    message: 'Expense Manager Server is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Serve static frontend build assets in production
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://127.0.0.1:${PORT}`);
});
