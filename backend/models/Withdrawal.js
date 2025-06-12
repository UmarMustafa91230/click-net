const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [100, 'Minimum withdrawal amount is 100']
  },
  method: {
    type: String,
    required: [true, 'Withdrawal method is required'],
    enum: ['easypaisa', 'jazzcash', 'binance']
  },
  accountDetails: {
    type: String,
    required: [true, 'Account details are required']
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
withdrawalSchema.index({ user: 1, status: 1 });
withdrawalSchema.index({ status: 1 });

module.exports = mongoose.model('Withdrawal', withdrawalSchema); 