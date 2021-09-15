const Queue = require('bee-queue');
const Address = require('../db/Address');
const { fetchAccountNFTs } = require('../moralis/helpers/fetch-nfts');
const { queueNFTMetadata } = require('../services/nft-metadata');
const { setupQueue } = require('./base');

const queue = new Queue('sync_nfts', {
  prefix: 'doko',
  removeOnSuccess: true,
  removeOnFailure: true
});

queue.removeJob('0x373fb9eed5f48cbab800a5e4f01ad0ade3bee754');

queue.on('ready', () => {
  console.log(`QUEUE ${queue.name} is ready`);

  queue.process(10, async job => {
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
    const nfts = await fetchAccountNFTs(address).then(items =>
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
      await queueNFTMetadata(nft);
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

setupQueue(queue);

module.exports = queue;
