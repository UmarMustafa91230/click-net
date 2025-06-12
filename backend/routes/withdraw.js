const express = require('express');
const router = express.Router();
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect, admin } = require('../middleware/authMiddleware');

// Check withdrawal eligibility
const checkWithdrawalEligibility = async (user) => {
  if (!user.firstDepositDate) {
    return {
      eligible: false,
      message: 'No deposits found. Please make a deposit first.'
    };
  }

  const daysSinceFirstDeposit = Math.floor(
    (Date.now() - user.firstDepositDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceFirstDeposit < 30) {
    return {
      eligible: false,
      message: `You can withdraw after ${30 - daysSinceFirstDeposit} days from your first deposit.`
    };
  }

  return { eligible: true };
};

// Submit withdrawal request
router.post('/', protect, async (req, res) => {
  try {
    const { amount, method, accountDetails } = req.body;
    const user = await User.findById(req.user._id);

    // Check eligibility
    const eligibility = await checkWithdrawalEligibility(user);
    if (!eligibility.eligible) {
      return res.status(400).json({ message: eligibility.message });
    }

    // Check balance
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create withdrawal request
    const withdrawal = await Withdrawal.create({
      user: req.user._id,
      amount,
      method,
      accountDetails,
      status: 'pending'
    });

    // Deduct amount from user's balance
    user.balance -= amount;
    await user.save();

    // Create transaction record
    await Transaction.create({
      user: req.user._id,
      type: 'withdraw',
      amount: amount,
      status: 'pending',
      reference: withdrawal._id,
      referenceModel: 'Withdrawal',
      description: `Withdrawal request of ${amount} via ${method}`,
      balance: user.balance
    });

    res.status(201).json(withdrawal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's withdrawals
router.get('/my-withdrawals', protect, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all withdrawals (admin)
router.get('/all', protect, admin, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    
    const withdrawals = await Withdrawal.find(query)
      .populate('user', 'name email')
      .populate('processedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve/Reject withdrawal (admin)
router.patch('/:id', protect, admin, async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ message: 'Withdrawal already processed' });
    }

    const user = await User.findById(withdrawal.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update withdrawal status
    withdrawal.status = status;
    withdrawal.adminNote = adminNote;
    withdrawal.processedBy = req.user._id;
    withdrawal.processedAt = Date.now();

    if (status === 'rejected') {
      // Return amount to user's balance
      user.balance += withdrawal.amount;
      await user.save();

      // Create transaction record for rejected withdrawal
      await Transaction.create({
        user: user._id,
        type: 'withdraw',
        amount: withdrawal.amount,
        status: 'failed',
        reference: withdrawal._id,
        referenceModel: 'Withdrawal',
        description: `Withdrawal rejected: ${withdrawal.amount} via ${withdrawal.method}`,
        balance: user.balance,
        processedBy: req.user._id,
        processedAt: Date.now()
      });
    } else if (status === 'approved') {
      // Create transaction record for approved withdrawal
      await Transaction.create({
        user: user._id,
        type: 'withdraw',
        amount: withdrawal.amount,
        status: 'completed',
        reference: withdrawal._id,
        referenceModel: 'Withdrawal',
        description: `Withdrawal approved: ${withdrawal.amount} via ${withdrawal.method}`,
        balance: user.balance,
        processedBy: req.user._id,
        processedAt: Date.now()
      });
    }

    await withdrawal.save();

    res.json({
      withdrawal,
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

// Get withdrawal statistics (admin)
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalWithdrawals = await Withdrawal.countDocuments();
    const pendingWithdrawals = await Withdrawal.countDocuments({ status: 'pending' });
    const approvedWithdrawals = await Withdrawal.countDocuments({ status: 'approved' });
    const totalAmount = await Withdrawal.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalWithdrawals,
      pendingWithdrawals,
      approvedWithdrawals,
      totalAmount: totalAmount[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 