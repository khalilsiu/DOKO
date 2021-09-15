const { isOpenseaNFT } = require('../moralis/helpers/utils');
const openseaQueue = require('../queue/opensea');
const nftQueue = require('../queue/single-nft');

const queueNFTMetadata = async nft => {
  const q = isOpenseaNFT(nft) ? openseaQueue : nftQueue;
  const jobId = `${nft.token_address}_${nft.token_id}`;

  if (await q.getJob(jobId)) {
    return;
  }
  await q.createJob(nft).setId(jobId).save();
};

module.exports = {
  queueNFTMetadata
};
