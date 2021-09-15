const { COLLECTIONS, CHAINS } = require('../constants');
const Collections = require('../db/Collections');
const { Moralis } = require('../libs/moralis');
const { fetchCollectionNFTs } = require('../moralis/helpers/fetch-nfts');
const { queueNFTMetadata } = require('./nft-metadata');

async function indexCollections() {
  const coll = new Collections();

  console.log('Started Indexing collections..');

  for (const collection of COLLECTIONS) {
    for (const chain of CHAINS) {
      try {
        const metadata = await Moralis.Web3API.token.getNFTMetadata({
          chain,
          address: collection.address
        });
        await coll.instance.updateOne(
          {
            token_address: collection.address
          },
          {
            $set: metadata
          },
          {
            upsert: true
          }
        );
        const items = await fetchCollectionNFTs(collection.address);

        for (const item of items) {
          await queueNFTMetadata(item);
        }
        break;
      } catch (err) {}
    }
  }
}

module.exports = {
  indexCollections
};
