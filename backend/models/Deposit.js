const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [100, 'Minimum deposit amount is 100']
  },
  method: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['easypaisa', 'jazzcash', 'binance']
  },
  screenshot: {
    type: String,
    required: [true, 'Payment proof is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNote: {
    type: String,
    default: ''
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Add index for faster queries
depositSchema.index({ user: 1, status: 1 });
depositSchema.index({ status: 1 });

module.exports = mongoose.model('Deposit', depositSchema); 