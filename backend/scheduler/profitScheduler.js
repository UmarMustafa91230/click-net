const cron = require('node-cron');
const { processDailyProfits } = require('../services/profitService');

// Schedule daily profit calculation to run at midnight (00:00) every day
const scheduleDailyProfits = () => {
  // '0 0 * * *' means run at 00:00 every day
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('Running scheduled daily profit calculation...');
      const result = await processDailyProfits();
      console.log('Scheduled daily profit calculation completed:', result);
    } catch (error) {
      console.error('Error in scheduled daily profit calculation:', error);
    }
  });

  console.log('Daily profit scheduler initialized');
};

module.exports = {
  scheduleDailyProfits
}; 