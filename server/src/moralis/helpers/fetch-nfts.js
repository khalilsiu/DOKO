const _ = require('lodash');
const { default: axios } = require('axios');
const { Moralis } = require('../../libs/moralis');
const { isValidHttpUrl, wait, isOpenseaNFT } = require('./utils');
const { CHAINS } = require('../../constants');
const NFTS = require('../../db/Nfts');

const fetchAccountNFTs = async (address, chain) => {
  if (chain && !CHAINS.includes(chain)) {
    return [];
  }
  const chains = chain ? [chain] : CHAINS;

  try {
    let all = [];

    for (const chain of chains) {
      let nfts = [];

      while (1) {
        const { total, result } = await Moralis.Web3API.account.getNFTs({
          address,
          chain
        });
        nfts = nfts.concat(result);

        if (nfts.length >= total) {
          nfts = nfts.map(nft => ({ ...nft, chain }));
          break;
        }
      }
      all = all.concat(nfts);
    }
    return all;
  } catch (err) {
    console.error('fetchAccountNFTs:\n', err);
    return [];
  }
};

const fetchCollectionNFTs = async (address, chain) => {
  if (chain && !CHAINS.includes(chain)) {
    return [];
  }
  const chains = chain ? [chain] : CHAINS;

  try {
    let all = [];

    for (const chain of chains) {
      let nfts = [];

      while (1) {
        const { total, result } = await Moralis.Web3API.token.getNFTOwners({
          address,
          chain
        });
        nfts = nfts.concat(result);

        if (nfts.length >= total) {
          nfts = nfts.map(nft => ({ ...nft, chain }));
          break;
        }
      }
      all = all.concat(nfts);
    }
    return all;
  } catch (err) {
    console.error('fetchCollectionNFTs:\n', err);
    return [];
  }
};

const fetchNFTMetadata = async nft => {
  let metadata;
  let metadata_updated = false;

  if (!nft.token_uri) {
    metadata = null;
    metadata_updated = true;
  } else if (isValidHttpUrl(nft.token_uri)) {
    try {
      if (isOpenseaNFT(nft)) {
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
      metadata = { error: true, reason: 'API', ...errorData };
    }
  } else if (nft.token_uri.includes('data:application/json;utf8,')) {
    try {
      metadata = JSON.parse(nft.token_uri.replace('data:application/json;utf8,', ''));
      metadata_updated = true;
    } catch (err) {
      metadata = { error: true, reason: 'JSON' };
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
      metadata = { error: true, reason: 'BASE64' };
      console.error('NFT get error:\n', err, nft.token_uri);
    }
  } else {
    try {
      metadata = JSON.parse(nft.token_uri);
      metadata_updated = true;
    } catch (err) {
      metadata = { error: true, reason: 'STRING' };
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
    metadata_updated
  };
  return newNFT;
};

const setMetadata = async nft => {
  const nftsCollection = new NFTS();
  const newNFT = await fetchNFTMetadata(nft); // Updated NFT metadata from token uri
  const query = {
    token_id: nft.token_id,
    token_address: nft.token_address
  };

  if (!newNFT) {
    await nftsCollection.deleteOne(query);
    return;
  }

  try {
    delete nft._id;
    return await nftsCollection.updateOrInsertOne(query, newNFT);
  } catch (err) {
    console.error('setMetadata:\n', err);
  }
};

module.exports = {
  fetchAccountNFTs,
  fetchCollectionNFTs,
  fetchNFTMetadata,
  setMetadata
};
