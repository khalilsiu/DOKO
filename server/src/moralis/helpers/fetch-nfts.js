const { Moralis } = require('../../libs/moralis');
const _ = require('lodash');

const fetchNFTs = async (address, chain) => {
  const chains = chain ? [chain] : ['eth', 'bsc', 'matic'];

  try {
    const nftCollections = await Promise.all(
      chains.map(c =>
        Moralis.Web3.getNFTs({
          address,
          chain: c
        })
      )
    );
    chains.forEach((chain, index) => {
      for (const nft of nftCollections[index]) {
        nft.chain = chain;
      }
    });
    return _.flatten(nftCollections);
  } catch (err) {
    console.error('NFT collection error:\n', err);
    return [];
  }
};

module.exports = {
  fetchNFTs
};
