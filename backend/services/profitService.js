const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Calculate daily profit for a user
const calculateDailyProfit = async (user) => {
  try {
    // Get all approved deposits
    const deposits = await Transaction.find({
      user: user._id,
      type: 'deposit',
      status: 'completed'
    });

    if (deposits.length === 0) {
      return null;
    }

    // Calculate total approved deposits
    const totalDeposits = deposits.reduce((sum, deposit) => sum + deposit.amount, 0);

    // Calculate daily profit (30% of total deposits / 30 days)
    const dailyProfit = (totalDeposits * 0.30) / 30;

    return {
      user,
      dailyProfit,
      totalDeposits
    };
  } catch (error) {
    console.error('Error calculating daily profit:', error);
    return null;
  }
};

// Process daily profits for all eligible users
const processDailyProfits = async () => {
  try {
    console.log('Starting daily profit processing...');
    const users = await User.find({});
    const profitRate = 0.30 / 365; // Assuming 30% annual profit, daily rate

    for (const user of users) {
      // Calculate profit based on current balance
      const dailyProfit = user.balance * profitRate;

      if (dailyProfit > 0) {
        // Create a profit transaction
        const profitTransaction = new Transaction({
          user: user._id,
          type: 'profit',
          amount: dailyProfit,
          status: 'completed', // Assuming profit is automatically completed
          description: 'Daily profit allocation',
          balance: user.balance + dailyProfit, // New balance after profit
        });

        await profitTransaction.save();

        // Update user's balance
        user.balance += dailyProfit;
        await user.save();
        console.log(`Processed daily profit for user ${user.email}. Amount: ${dailyProfit.toFixed(2)}`);
      } else {
        console.log(`No daily profit to process for user ${user.email}. Balance: ${user.balance}`);
      }
    }

    console.log('Daily profit processing completed.');
    return { success: true, message: 'Daily profits processed' };

  } catch (error) {
    console.error('Error processing daily profits:', error);
    throw error;
  }
};

module.exports = {
  calculateDailyProfit,
  processDailyProfits
}; 