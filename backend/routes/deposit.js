const express = require('express');
const router = express.Router();
const Deposit = require('../models/Deposit');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Submit deposit (user)
router.post('/', protect, upload.single('screenshot'), async (req, res) => {
  try {
    const { amount, method } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Payment proof is required' });
    }

    const deposit = await Deposit.create({
      user: req.user._id,
      amount,
      method,
      screenshot: req.file.path
    });

    // Create transaction record
    await Transaction.create({
      user: req.user._id,
      type: 'deposit',
      amount: amount,
      status: 'pending',
      reference: deposit._id,
      referenceModel: 'Deposit',
      description: `Deposit request of ${amount} via ${method}`,
      balance: req.user.balance
    });

    res.status(201).json(deposit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's deposits
router.get('/my-deposits', protect, async (req, res) => {
  try {
    const deposits = await Deposit.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(deposits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all deposits (admin)
router.get('/all', protect, admin, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    
    const deposits = await Deposit.find(query)
      .populate('user', 'name email')
      .populate('processedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json(deposits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve/Reject deposit (admin)
router.patch('/:id', protect, admin, async (req, res) => {
  try {
    const { status, adminNote, approvedAmount } = req.body;
    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) {
      return res.status(404).json({ message: 'Deposit not found' });
    }

    if (deposit.status !== 'pending') {
      return res.status(400).json({ message: 'Deposit already processed' });
    }

    const user = await User.findById(deposit.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update deposit status
    deposit.status = status;
    deposit.adminNote = adminNote;
    deposit.processedBy = req.user._id;
    deposit.processedAt = Date.now();

    // If approved, update user's balance with admin input amount
    if (status === 'approved') {
      if (!approvedAmount || approvedAmount <= 0) {
        return res.status(400).json({ message: 'Please provide a valid approved amount' });
      }

      // Update user's balance with admin input amount
      user.balance += approvedAmount;
      
      // Set firstDepositDate if it's the first deposit
      if (!user.firstDepositDate) {
        user.firstDepositDate = new Date();
      }
      
      // Update the deposit amount to match the approved amount
      deposit.amount = approvedAmount;
      
      await user.save();

      // Create transaction record for approved deposit
      await Transaction.create({
        user: user._id,
        type: 'deposit',
        amount: approvedAmount,
        status: 'completed',
        reference: deposit._id,
        referenceModel: 'Deposit',
        description: `Deposit approved: ${approvedAmount} via ${deposit.method}`,
        balance: user.balance,
        processedBy: req.user._id,
        processedAt: Date.now()
      });
    } else if (status === 'rejected') {
      // Create transaction record for rejected deposit
      await Transaction.create({
        user: user._id,
        type: 'deposit',
        amount: deposit.amount,
        status: 'failed',
        reference: deposit._id,
        referenceModel: 'Deposit',
        description: `Deposit rejected: ${deposit.amount} via ${deposit.method}`,
        balance: user.balance,
        processedBy: req.user._id,
        processedAt: Date.now()
      });
    }

    await deposit.save();

    // Return updated user data along with deposit
    const updatedUser = await User.findById(deposit.user).select('-password');
    
    res.json({
      deposit,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get deposit statistics (admin)
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalDeposits = await Deposit.countDocuments();
    const pendingDeposits = await Deposit.countDocuments({ status: 'pending' });
    const approvedDeposits = await Deposit.countDocuments({ status: 'approved' });
    const totalAmount = await Deposit.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalDeposits,
      pendingDeposits,
      approvedDeposits,
      totalAmount: totalAmount[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Manual balance update (admin)
router.post('/update-balance/:userId', protect, admin, async (req, res) => {
  try {
    const { amount, note } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a deposit record for the manual update
    const deposit = await Deposit.create({
      user: user._id,
      amount,
      method: 'manual',
      screenshot: 'manual-update',
      status: 'approved',
      adminNote: note || 'Manual balance update',
      processedBy: req.user._id,
      processedAt: Date.now()
    });

    // Update user's balance
    user.balance += amount;
    
    // Set firstDepositDate if it's the first deposit
    if (!user.firstDepositDate) {
      user.firstDepositDate = new Date();
    }
    
    await user.save();

    res.json({
      message: 'Balance updated successfully',
      deposit,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        firstDepositDate: user.firstDepositDate
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 