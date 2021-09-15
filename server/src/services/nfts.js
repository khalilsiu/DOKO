const NFTS = require('../db/Nfts');
const accountSync = require('../queue/account-sync');
const { queueNFTMetadata } = require('./nft-metadata');

const updateNFTs = async address => {
  console.log('updateNFTs:', address);
  const query = { metadata_updated: false };

  if (address) {
    query.owner_of = address;
  }
  const collection = new NFTS();
  const nfts = await collection.find(query);
  console.log('updateNFTs: nfts', nfts.length);

  for (const nft of nfts) {
    await queueNFTMetadata(nft);
  }
};

const processSyncNFTsJob = async address => {
  await accountSync.createJob({ address }).setId(address).retries(2).save();
};

const syncNFTs = async (address, address_status) => {
  try {
    switch (address_status.sync_status) {
      case 'empty':
        return;
      case 'progress':
        const job = await accountSync.getJob(address);

        if (job) {
          console.log('IN PROGRESS:', job.data);
          return;
        }
        await processSyncNFTsJob(address);
        return;
      case 'done':
        return;
      case 'new':
        await processSyncNFTsJob(address);
        return;
    }
  } catch (err) {
    console.error('syncNFTs:', err);
  }
};

module.exports = {
  updateNFTs,
  syncNFTs
};
