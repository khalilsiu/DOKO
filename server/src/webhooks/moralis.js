const { database } = require('../db');
const { Moralis } = require('../libs/moralis');
const { fetchNFTMetadata } = require('../moralis/helpers/fetch-nfts');

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
  const collection = database().collection('nfts');
  const query = { token_id, token_address };
  const exists = await collection.findOne(query);

  const nft = await Moralis.Web3API.token.getTokenIdMetadata({
    token_address,
    'token_id}': token_id
  });
  const nftWithMetadata = await fetchNFTMetadata(nft, to_address);

  if (exists) {
    await collection.updateOne(query, {
      $set: nftWithMetadata
    });
  } else {
    await collection.insertOne(nftWithMetadata);
  }
  return res.json({ success: true });
};

module.exports = {
  afterSaveNftTransactions
};
