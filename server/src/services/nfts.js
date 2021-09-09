const NFTS = require('../db/Nfts');
const { fetchNFTMetadata } = require('../moralis/helpers/fetch-nfts');
const { nftSyncQueue } = require('../queue');

const updateNFTs = async address => {
  console.log('updateNFTs:', address);
  const query = { metadata_updated: false };

  if (address) {
    query.owner = address;
  }
  const collection = new NFTS();
  const nfts = await collection.find(query);
  console.log('updateNFTs: nfts', nfts.length);

  for (const nft of nfts) {
    if (!nft.token_uri) {
      continue;
    }
    try {
      const newNFT = await fetchNFTMetadata(nft, nft.owner);
      const query = {
        token_id: nft.token_id,
        token_address: nft.token_address
      };

      if (!newNFT) {
        await collection.deleteOne(query);
        continue;
      }
      await collection.updateOne(query, newNFT);
    } catch (err) {
      console.error('updateMetadata:', err);
    }
  }
};

const processSyncNFTsJob = async address => {
  await nftSyncQueue
    .createJob({ address })
    .setId(address)
    .retries(2)
    .save()
    .then(job => {
      console.log('JOB CREATED: ', job.id, job.data);
    });
};

const syncNFTs = async (address, address_status) => {
  try {
    switch (address_status.sync_status) {
      case 'empty':
        return;
      case 'progress':
        const job = await nftSyncQueue.getJob(address);

        if (job) {
          console.log('IN PROGRESS:', job.data);
          return;
        }
        await processSyncNFTsJob(address);
        return;
      case 'done':
        await updateNFTs(address);
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
