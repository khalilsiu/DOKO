const Queue = require('bee-queue');
const Address = require('../db/Address');
const NFTS = require('../db/Nfts');
const { fetchNFTs, fetchNFTMetadata } = require('../moralis/helpers/fetch-nfts');
const { wait } = require('../moralis/helpers/utils');

const queue = new Queue('sync_nfts', {
  prefix: 'doko',
  removeOnSuccess: true
});

queue.on('ready', () => {
  console.log(`QUEUE ${queue.name} is ready`);

  queue.process(2, async job => {
    const addressCollection = new Address();
    console.log(`NFT Sync Start: ${job.id}`, job.data);
    const { address } = job.data;

    await addressCollection.updateOne(
      { address },
      {
        sync_status: 'progress',
        sync_progress: 0,
        timestamp: Date.now() / 1000
      }
    );
    const nfts = await fetchNFTs(address).then(items =>
      items.sort((a, b) => {
        if (a.name && b.name) {
          return a.name > b.name ? 1 : -1;
        }

        if (a.name && !b.name) {
          return 1;
        }

        if (!a.name && b.name) {
          return -1;
        }

        return a.token_address > b.token_address
          ? 1
          : a.token_address < b.token_address
          ? -1
          : a.token_id > b.token_d
          ? 1
          : -1;
      })
    );

    console.log(`SYNC: ${address} - ${nfts.length}`);

    if (!nfts.length) {
      await addressCollection.updateOne(
        { address },
        {
          sync_status: 'empty',
          sync_progress: 0,
          timestamp: Date.now() / 1000
        }
      );
      return;
    }

    for (const nft of nfts) {
      console.log(`SYNC RUNNIG: ${job.id} - ${nft.token_uri}`);
      await setMetadata(nft, address);
      await addressCollection.updateOne(
        { address },
        {
          sync_status: 'progress',
          sync_progress: Math.floor((nfts.indexOf(nft) / nfts.length) * 100),
          timestamp: Date.now() / 1000
        }
      );
    }

    await addressCollection.updateOne(
      { address },
      {
        sync_status: 'done',
        sync_progress: 0,
        timestamp: Date.now() / 1000
      }
    );
  });
});

queue.on('job succeeded', (jobId, result) => {
  console.log(`QUEUE ${queue.name}: JOB ${jobId} - SUCCESS\n`, result);
});

queue.on('job retrying', (jobId, error) => {
  console.error(`QUEUE ${queue.name}: JOB ${jobId} - RETRYING\n`, error);
});

queue.on('job failed', (jobId, error) => {
  console.log(`QUEUE ${queue.name}: JOB ${jobId} - FAILED\n`, error);
});

queue.on('error', err => {
  console.error(`QUEUE ${queue.name} - ERROR\n`, err);
});

const setMetadata = async (nft, address) => {
  const newNFT = await fetchNFTMetadata(nft, address); // Updated NFT metadata from token uri
  await wait(1500); // Waiting because of OpenSea throttling issue
  const nftsCollection = new NFTS();

  try {
    const query = {
      token_id: newNFT.token_id,
      token_address: newNFT.token_address
    };
    return await nftsCollection.instance.updateOne(
      query,
      { $set: newNFT },
      {
        upsert: true
      }
    );
  } catch (err) {
    console.error('setMetadata:\n', err);
  }
};

module.exports = {
  nftSyncQueue: queue
};
