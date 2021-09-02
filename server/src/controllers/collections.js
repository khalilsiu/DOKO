const { database } = require('../db');
const { Moralis } = require('../libs/moralis');
const { fetchNFTs, fetchNFTMetadata } = require('../moralis/helpers/fetch-nfts');

const setMetadata = async (nft, address) => {
  const newNFT = await fetchNFTMetadata(nft, address);
  const db = database();
  const collection = db.collection('nfts');

  try {
    const query = {
      token_id: newNFT.token_id,
      token_address: newNFT.token_address
    };
    const exists = await collection.findOne(query);

    if (exists) {
      return await collection.updateOne(query, {
        $set: newNFT
      });
    } else {
      return await collection.insertOne(newNFT);
    }
  } catch (err) {
    console.error('NFT save error:\n', err);
  }
};

const watchAddress = async address => {
  let watching = 0;

  for (const chain of ['Eth', 'Bsc', 'Polygon']) {
    const className = `Watched${chain}Address`;
    const query = new Moralis.Query(Moralis.Object.extend(className));

    try {
      query.equalTo('address', address);
      const exists = await query.find();

      if (exists.length) {
        watching++;
        continue;
      }
    } catch (err) {}

    Moralis.Cloud.run(`watch${chain}Address`, {
      address
    });
  }
  return watching;
};

const controller = {
  getNFTs: async (req, res) => {
    const { offset, address, chain, term, orderBy, direction } = req.query;
    const collection = database().collection('nfts');

    const query = {
      owner: address
    };

    if (chain) {
      query.chain = {
        $in: chain
      };
    }

    if (term) {
      query.name = new RegExp(`/.*${term}.*/`);
    }

    const items = await collection
      .find(query)
      .sort({ [orderBy || 'name']: +direction || 1 })
      .skip(+offset || 0)
      .limit(12)
      .toArray();

    return res.json(items);
  },
  indexCollections: async (req, res, next) => {
    const { address } = req.body;

    console.log('indexCollections: ', address);

    const watching = await watchAddress(address);

    if (watching === 3) {
      return res.json({ message: 'Already indexed' });
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
