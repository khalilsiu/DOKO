const { Moralis } = require('../libs/moralis');
const NFT = require('../moralis/subclass/nft');

const afterSaveNftTransactions = async (req, res) => {
  console.log(req.body);
  const {
    object: { to_address, token_address, token_id, className, confirmed }
  } = req.body;

  if (!confirmed) {
    return;
  }
  const addressClassMapping = {
    EthNFTTransfers: 'Eth',
    BscNFTTransfers: 'Bsc',
    PolygonNFTTransfers: 'Polygon'
  };
  console.log(addressClassMapping[className]);

  if (!addressClassMapping[className]) {
    return res.status(400);
  }
  const nftQuery = new Moralis.Query(NFT);

  nftQuery.equalTo('token_id', token_id);
  nftQuery.equalTo('token_address', token_address);

  const nfts = await nftQuery.find();
  const nft = nfts[0];

  if (nft) {
    nft.set('owner', to_address);
    await nft.save();
  } else {

  }
};

module.exports = {
  afterSaveNftTransactions
};
