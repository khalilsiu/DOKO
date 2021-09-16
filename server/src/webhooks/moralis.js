const NFTS = require('../db/Nfts');
const { Moralis } = require('../libs/moralis');
const { queueNFTMetadata } = require('../services/nft-metadata');

const afterSaveNftTransactions = async (req, res) => {
  console.log('NFT Transfer Webhook:', req.body);

  const {
    object: { to_address, token_address, token_id, className }
  } = req.body;

  const addressClassMapping = {
    EthNFTTransfers: 'Eth',
    BscNFTTransfers: 'Bsc',
    PolygonNFTTransfers: 'Polygon'
  };

  if (!addressClassMapping[className]) {
    return res.status(400);
  }
  const collection = new NFTS();
  const query = { token_id, token_address };

  if (to_address === '0x000000000000000000000000000000000000dEaD') {
    await collection.deleteOne(query);
    return res.json({ success: true });
  }

  try {
    const nft = await Moralis.Web3API.token.getTokenIdMetadata({
      address: token_address,
      token_id,
      chain: addressClassMapping[className].toLowerCase()
    });
    await queueNFTMetadata(nft);
  } catch (err) {
    console.error('WEBHOOK ERROR:', err);
    return res.json({ success: false, token_id, token_address });
  }

  return res.json({ success: true });
};

module.exports = {
  afterSaveNftTransactions
};
