const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect, admin } = require('../middleware/authMiddleware');

// Get user's transactions with filters
router.get('/my-transactions', protect, async (req, res) => {
  try {
    console.log('Received request for /transactions/my-transactions');
    console.log('User ID:', req.user._id);
    console.log('Request query params:', req.query);
    const { type, status, startDate, endDate, page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };

    // Apply filters
    if (type) query.type = type;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    console.log('Transaction query:', query);
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    console.log('Found transactions:', transactions);
    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTransactions: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all transactions (admin)
router.get('/all', protect, admin, async (req, res) => {
  try {
    const {
      type,
      status,
      userId,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    // Apply filters
    if (type) query.type = type;
    if (status) query.status = status;
    if (userId) query.user = userId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .populate('user', 'name email')
      .populate('processedBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTransactions: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get transaction statistics (admin)
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const matchStage = {};

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    const stats = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          byStatus: {
            $push: {
              status: '$status',
              amount: '$amount'
            }
          }
        }
      }
    ]);

    // Process stats for better readability
    const processedStats = stats.reduce((acc, curr) => {
      acc[curr._id] = {
        totalAmount: curr.totalAmount,
        count: curr.count,
        byStatus: curr.byStatus.reduce((statusAcc, status) => {
          if (!statusAcc[status.status]) {
            statusAcc[status.status] = { count: 0, amount: 0 };
          }
          statusAcc[status.status].count++;
          statusAcc[status.status].amount += status.amount;
          return statusAcc;
        }, {})
      };
      return acc;
    }, {});

    res.json(processedStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 