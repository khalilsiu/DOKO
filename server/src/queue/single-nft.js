const Queue = require('bee-queue');
const { setMetadata } = require('../moralis/helpers/fetch-nfts');
const { setupQueue } = require('./base');

const queue = new Queue('fetch_nft_metadata', {
  prefix: 'doko',
  removeOnSuccess: true,
  removeOnFailure: true
});

queue.on('ready', () => {
  console.log(`QUEUE ${queue.name} is ready`);

  queue.process(24, async job => {
    console.log(`QUEUE - ${queue.name} - ${job.id}: Start`, job.data);
    await setMetadata(job.data);
  });
});

setupQueue(queue);

module.exports = queue;
