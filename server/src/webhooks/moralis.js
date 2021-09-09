const NFTS = require('../db/Nfts');
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
  const collection = new NFTS();
  const query = { token_id, token_address };

  try {
    const nft = await Moralis.Web3API.token.getTokenIdMetadata({
      address: token_address,
      token_id
    });

    const nftWithMetadata = await fetchNFTMetadata(nft, to_address);

    if (!nftWithMetadata || to_address === '0x000000000000000000000000000000000000dEaD') {
      return await collection.deleteOne(query);
    }
    return await collection.instance.updateOne(
      query,
      { $set: nftWithMetadata },
      {
        upsert: true
      }
    );
  } catch (err) {
    console.error('WEBHOOK ERROR:', err);
  }

  return res.json({ success: true });
};

module.exports = {
  afterSaveNftTransactions
};
