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
    console.log(address, nftCollections);
    chains.forEach((chain, index) => {
      for (const nft of nftCollections[index]) {
        nft.chain = chain;
      }
    });
    return _.flatten(nftCollections);
  } catch (err) {
    console.error('fetchNFTs:\n', err);
    return [];
  }
};

const fetchNFTMetadata = async (nft, address) => {
  let metadata;
  let metadata_updated = false;

  if (!nft.token_uri) {
    metadata = null;
  } else if (isValidHttpUrl(nft.token_uri)) {
    try {
      const nftRes = await axios.get(nft.token_uri);
      metadata = nftRes.data;
      metadata_updated = true;
    } catch (err) {
      console.error('NFT get error:\n', { error: err.response?.data, nft });
      metadata = { error: 'API', message: err.response?.data };
    }
  } else if (nft.token_uri.includes('data:application/json;utf8,')) {
    try {
      metadata = JSON.parse(nft.token_uri.replace('data:application/json;utf8,', ''));
      metadata_updated = true;
    } catch (err) {
      metadata = { error: 'JSON' };
      console.error('NFT get error:\n', err, nft);
    }
  } else if (nft.token_uri.includes('data:application/json;base64,')) {
    try {
      const buff = Buffer.from(
        nft.token_uri.replace('data:application/json;base64,', ''),
        'base64'
      );
      metadata = JSON.parse(buff.toString('utf-8'));
      metadata_updated = true;
    } catch (err) {
      metadata = { error: 'BASE64' };
      console.error('NFT get error:\n', err, nft);
    }
  } else {
    try {
      metadata = JSON.parse(nft.token_uri);
      metadata_updated = true;
    } catch (err) {
      metadata = { error: 'STRING' };
      console.error('NFT get error:\n', err, nft);
    }
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
    metadata_updated
  };
  return newNFT;
};

module.exports = {
  fetchNFTs,
  fetchNFTMetadata
};
