const axios = require('axios');
const _ = require('lodash');

const { Moralis } = require('../libs/moralis');
const { fetchNFTs } = require('../moralis/helpers/fetch-nfts');
const NFT = require('../moralis/subclass/nft');

const isValidHttpUrl = string => {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
};

const setMetadata = async (nft, address) => {
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
    return;
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
  return await NFT.save(newNFT);
};

const controller = {
  indexCollections: async (req, res, next) => {
    const { address } = req.body;

    for (const chain of ['Eth', 'Bsc', 'Polygon']) {
      Moralis.Cloud.run(`watch${chain}Address`, {
        address
      });
    }
    const nfts = await fetchNFTs(address);

    for (const nft of nfts.sort((a, b) => {
      if (a.name && b.name) {
        return a.name > b.name ? 1 : -1;
      }

      if (a.name && !b.name) {
        return 1;
      }

      if (!a.name && b.name) {
        return -1;
      }

      return a.token_address > b.token_address
        ? 1
        : a.token_address < b.token_address
        ? -1
        : a.token_id > b.token_d
        ? 1
        : -1;
    })) {
      await setMetadata(nft, address);
    }
    return res.json({ success: true });
  }
};

module.exports = controller;
