const { Moralis } = require('../../libs/moralis');
const _ = require('lodash');
const { isValidHttpUrl } = require('./utils');
const { default: axios } = require('axios');

const fetchNFTs = async (address, chain) => {
  const chains = chain ? [chain] : ['eth', 'bsc', 'polygon'];

  try {
    const nftCollections = await Promise.all(
      chains.map(c =>
        Moralis.Web3API.account.getNFTs({
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

const fetchNFTMetadata = async (nft, address) => {
  let metadata;

  if (!nft.token_uri) {
    metadata = null;
  } else if (isValidHttpUrl(nft.token_uri)) {
    try {
      const nftRes = await axios.get(nft.token_uri);
      metadata = nftRes.data;
    } catch (err) {
      console.error('NFT get error:\n', err.response);
    }
  } else if (nft.token_uri.includes('data:application/json;utf8,')) {
    try {
      metadata = JSON.parse(nft.token_uri.replace('data:application/json;utf8,', ''));
    } catch (err) {
      console.error('NFT get error:\n', err, nft);
    }
  } else if (nft.token_uri.includes('data:application/json;base64,')) {
    try {
      const buff = Buffer.from(
        nft.token_uri.replace('data:application/json;base64,', ''),
        'base64'
      );
      metadata = JSON.parse(buff.toString('utf-8'));
    } catch (err) {
      console.error('NFT get error:\n', err, nft);
    }
  } else {
    console.error('NFT get error:\n', nft);
  }
  const newNFT = {
    ...nft,
    metadata: metadata
      ? {
          ...metadata,
          image: metadata.image || metadata.image_url || ''
        }
      : {},
    owner: address,
    metadata_updated: !!metadata
  };
  return newNFT;
};

module.exports = {
  fetchNFTs,
  fetchNFTMetadata
};
