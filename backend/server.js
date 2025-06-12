const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { scheduleDailyProfits } = require('./scheduler/profitScheduler');

// Load environment variables
dotenv.config();


// Create Express app
const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route to verify server is working
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Test route for API
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/deposit', require('./routes/deposit'));
app.use('/api/withdraw', require('./routes/withdraw'));
app.use('/api/transaction', require('./routes/transaction'));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    path: req.path
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Initialize profit scheduler after successful database connection
    scheduleDailyProfits();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test the server at: http://localhost:${PORT}/test`);
  console.log(`Test the API at: http://localhost:${PORT}/api/test`);
}); 