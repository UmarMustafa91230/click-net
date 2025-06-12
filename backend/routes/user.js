const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const Transaction = require('../models/Transaction');

// Test route to verify user routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'User routes are working!' });
});

// Verify token and role
router.get('/verify-token', protect, (req, res) => {
  res.json({ 
    message: 'Token is valid',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Test protected route
router.get('/test-protected', protect, (req, res) => {
  res.json({ 
    message: 'Protected route is working!',
    user: req.user
  });
});

// Get user dashboard
router.get('/dashboard', protect, async (req, res) => {
  try {
    // Check if user is trying to access with admin token
    if (req.user.role === 'admin') {
      return res.status(403).json({ 
        message: 'Admin cannot access user dashboard. Please use a user account.' 
      });
    }

    const user = await User.findById(req.user._id).select('-password');
    
    // Calculate eligibility for withdrawal
    const isEligibleForWithdrawal = user.firstDepositDate 
      ? (new Date() - new Date(user.firstDepositDate)) >= (30 * 24 * 60 * 60 * 1000)
      : false;

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        firstDepositDate: user.firstDepositDate
      },
      isEligibleForWithdrawal
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user dashboard stats (new route)
router.get('/dashboard-stats', protect, async (req, res) => {
  try {
    // Check if user is trying to access with admin token
    if (req.user.role === 'admin') {
      return res.status(403).json({
        message: 'Admin cannot access user dashboard stats. Please use a user account.'
      });
    }

    const user = await User.findById(req.user._id).select('balance');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate total balance
    const totalBalance = user.balance || 0;

    // Calculate monthly profit (example: sum of profit transactions in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthlyProfitTransactions = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'profit',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          totalProfit: { $sum: '$amount' }
        }
      }
    ]);

    const monthlyProfit = monthlyProfitTransactions.length > 0 ? monthlyProfitTransactions[0].totalProfit : 0;

    // Calculate daily profit (example: sum of profit transactions today)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const dailyProfitTransactions = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'profit',
          createdAt: { $gte: startOfToday }
        }
      },
      {
        $group: {
          _id: null,
          totalProfit: { $sum: '$amount' }
        }
      }
    ]);

    const dailyProfit = dailyProfitTransactions.length > 0 ? dailyProfitTransactions[0].totalProfit : 0;

    res.json({
      totalBalance,
      monthlyProfit,
      dailyProfit,
    });

  } catch (error) {
    console.error('Error fetching user dashboard stats:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 