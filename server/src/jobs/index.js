const cron = require('node-cron');
const { updateNFTs } = require('../services/nfts');

const setupCronJobs = () => {
  cron.schedule('0 */1 * * *', async () => {
    console.log('Cron Job: updateNFTsMetadata - start');
    await updateNFTs();
    console.log('Cron Job: updateNFTsMetadata - end');
  });
};

module.exports = {
  setupCronJobs
};
