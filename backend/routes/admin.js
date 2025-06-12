const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Deposit = require('../models/Deposit');
const Withdrawal = require('../models/Withdrawal');
const Transaction = require('../models/Transaction');
const { protect, admin } = require('../middleware/authMiddleware');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for admin user
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users with pagination and filters
router.get('/users', protect, admin, async (req, res) => {
  try {
    const { 
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const query = {};
    
    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user details with their transactions
router.get('/users/:userId', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's recent transactions
    const transactions = await Transaction.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get user's pending deposits and withdrawals
    const pendingDeposits = await Deposit.find({
      user: user._id,
      status: 'pending'
    });

    const pendingWithdrawals = await Withdrawal.find({
      user: user._id,
      status: 'pending'
    });

    res.json({
      user,
      recentTransactions: transactions,
      pendingDeposits,
      pendingWithdrawals
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user status
router.patch('/users/:userId/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = status;
    await user.save();

    res.json({
      message: 'User status updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user balance manually
router.post('/users/:userId/balance', protect, admin, async (req, res) => {
  try {
    const { amount, type, note } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's balance
    if (type === 'add') {
      user.balance += amount;
    } else if (type === 'subtract') {
      if (user.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      user.balance -= amount;
    } else {
      return res.status(400).json({ message: 'Invalid operation type' });
    }

    await user.save();

    // Create transaction record
    await Transaction.create({
      user: user._id,
      type: 'manual',
      amount: type === 'add' ? amount : -amount,
      status: 'completed',
      description: note || `Manual balance ${type === 'add' ? 'addition' : 'subtraction'}`,
      balance: user.balance,
      processedBy: req.user._id,
      processedAt: Date.now()
    });

    res.json({
      message: 'Balance updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard statistics
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    console.log('Received request for /admin/dashboard');
    // Get total users
    const totalUsers = await User.countDocuments();
    console.log('totalUsers:', totalUsers);
    const activeUsers = await User.countDocuments({ status: 'active' });
    console.log('activeUsers:', activeUsers);

    // Get total deposits and withdrawals
    let depositStats = [];
    try {
      depositStats = await Transaction.aggregate([
        { $match: { type: 'deposit', status: 'completed' } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]);
      console.log('depositStats:', depositStats);
    } catch (aggError) {
      console.error('Error fetching deposit stats:', aggError);
      // Re-throw or handle as needed, for now let's log and continue if possible
      // throw aggError; // If you want the 500 error to propagate
    }

    let withdrawalStats = [];
    try {
      withdrawalStats = await Transaction.aggregate([
        { $match: { type: 'withdraw', status: 'completed' } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]);
      console.log('withdrawalStats:', withdrawalStats);
    } catch (aggError) {
      console.error('Error fetching withdrawal stats:', aggError);
      // throw aggError;
    }

    // Get profit statistics
    let profitStats = [];
    try {
      profitStats = await Transaction.aggregate([
        { $match: { type: 'profit', status: 'completed' } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]);
      console.log('profitStats:', profitStats);
    } catch (aggError) {
      console.error('Error fetching profit stats:', aggError);
      // throw aggError;
    }

    // Get pending requests
    const pendingDeposits = await Deposit.countDocuments({ status: 'pending' });
    console.log('pendingDeposits:', pendingDeposits);
    const pendingWithdrawals = await Withdrawal.countDocuments({ status: 'pending' });
    console.log('pendingWithdrawals:', pendingWithdrawals);

    // Get recent transactions
    const recentTransactions = await Transaction.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);
    console.log('recentTransactions count:', recentTransactions.length);

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers
      },
      deposits: {
        totalAmount: depositStats[0]?.totalAmount || 0,
        count: depositStats[0]?.count || 0
      },
      withdrawals: {
        totalAmount: withdrawalStats[0]?.totalAmount || 0,
        count: withdrawalStats[0]?.count || 0
      },
      profits: {
        totalAmount: profitStats[0]?.totalAmount || 0,
        count: profitStats[0]?.count || 0
      },
      pendingRequests: {
        deposits: pendingDeposits,
        withdrawals: pendingWithdrawals
      },
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create admin user (protected route)
router.post('/create', protect, admin, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const adminExists = await User.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 