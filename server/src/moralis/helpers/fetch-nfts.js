const { Moralis } = require('../../libs/moralis');
const _ = require('lodash');
const { isValidHttpUrl, wait } = require('./utils');
const { default: axios } = require('axios');

const fetchNFTs = async (address, chain) => {
  const chains = chain ? [chain] : ['eth', 'bsc', 'polygon'];

  try {
    let nftCollections = await Promise.all(
      chains.map(c =>
        Moralis.Web3API.account.getNFTs({
          address,
          chain: c
        })
      )
    );
    nftCollections = nftCollections.map(n => n.result || n);
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
    metadata_updated = true;
  } else if (isValidHttpUrl(nft.token_uri)) {
    try {
      if (nft.token_uri.includes('api.opensea.io')) {
        await wait(1500); // Waiting because of OpenSea throttling issue
      }
      const nftRes = await axios.get(nft.token_uri);

      metadata = nftRes.data;
      metadata_updated = true;

      if (nft.token_uri.includes('api.airnfts.com')) {
        metadata = metadata.nft;
      }
    } catch (err) {
      const errorData = {
        statusCode: err.response?.status,
        message: err.response?.data
      };
      console.error('NFT get error:\n', {
        tokenUri: nft.token_uri,
        ...errorData
      });

      if ([400, 403, 404].includes(err.response?.status)) {
        return null;
      }
      metadata = { error: 'API', ...errorData };
    }
  } else if (nft.token_uri.includes('data:application/json;utf8,')) {
    try {
      metadata = JSON.parse(nft.token_uri.replace('data:application/json;utf8,', ''));
      metadata_updated = true;
    } catch (err) {
      metadata = { error: 'JSON' };
      console.error('NFT get error:\n', err, nft.token_uri);
    }
  } else if (nft.token_uri.includes('data:application/json;base64,')) {
    try {
      const buff = Buffer.from(
        nft.token_uri.replace('data:application/json;base64,', ''),
        'base64'
      );
      let str = buff.toString('utf-8');

      if (str[str.length - 1] !== '}') {
        str += '}';
      }
      metadata = JSON.parse(str);
      metadata_updated = true;
    } catch (err) {
      metadata = { error: 'BASE64' };
      console.error('NFT get error:\n', err, nft.token_uri);
    }
  } else {
    try {
      metadata = JSON.parse(nft.token_uri);
      metadata_updated = true;
    } catch (err) {
      metadata = { error: 'STRING' };
      console.error('NFT get error:\n', err, nft.token_uri);
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
