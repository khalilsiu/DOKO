const cron = require('node-cron');
const { database } = require('../db');
const { fetchNFTMetadata } = require('../moralis/helpers/fetch-nfts');
const { wait } = require('../moralis/helpers/utils');

const setupCronJobs = () => {
  cron.schedule('0 */1 * * *', async () => {
    // const task = cron.schedule('* * * * *', async () => {
    console.log('starting job');
    const collection = database().collection('nfts');
    const nfts = await collection.find({ metadata_updated: false }).toArray();
    console.log(nfts.length);

    for (const nft of nfts) {
      if (!nft.token_uri) {
        continue;
      }
      await wait(1000);
      const newNFT = await fetchNFTMetadata(nft, nft.owner);
      await collection.updateOne(
        {
          token_id: newNFT.token_id,
          token_address: newNFT.token_address
        },
        {
          $set: newNFT
        }
      );
    }
  });
};

module.exports = {
  setupCronJobs
};
