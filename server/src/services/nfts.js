const Address = require('../db/Address');
const NFTS = require('../db/Nfts');
const { fetchNFTs, fetchNFTMetadata } = require('../moralis/helpers/fetch-nfts');
const { wait } = require('../moralis/helpers/utils');

const setMetadata = async (nft, address) => {
  const newNFT = await fetchNFTMetadata(nft, address); // Updated NFT metadata from token uri
  await wait(1500); // Waiting because of OpenSea throttling issue
  const nftsCollection = new NFTS();

  try {
    const query = {
      token_id: newNFT.token_id,
      token_address: newNFT.token_address
    };
    return await nftsCollection.instance.updateOne(
      query,
      { $set: newNFT },
      {
        upsert: true
      }
    );
  } catch (err) {
    console.error('setMetadata:\n', err);
  }
};

const updateNFTs = async address => {
  console.log('updateNFTs:', address);
  const query = { metadata_updated: false };

  if (address) {
    query.owner = address;
  }
  const collection = new NFTS();
  const nfts = await collection.find(query);
  console.log('updateNFTs: nfts', nfts);

  for (const nft of nfts) {
    if (!nft.token_uri) {
      continue;
    }
    try {
      await wait(1000);
      const newNFT = await fetchNFTMetadata(nft, nft.owner);
      await collection.updateOne(
        {
          token_id: newNFT.token_id,
          token_address: newNFT.token_address
        },
        newNFT
      );
    } catch (err) {
      console.error('updateMetadata:', err);
    }
  }
};

const syncNFTs = async (address, address_status) => {
  const addressCollection = new Address();

  try {
    switch (address_status.sync_status) {
      case 'progress':
      case 'empty':
        return;
      case 'done':
        await updateNFTs(address);
        return;
      case 'new': {
        addressCollection.updateOne(
          { address },
          {
            sync_status: 'progress',
            sync_progress: 0
          }
        );
        const nfts = await fetchNFTs(address).then(items =>
          items.sort((a, b) => {
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
          })
        );

        if (!nfts.length) {
          await addressCollection.updateOne(
            { address },
            {
              sync_status: 'empty',
              sync_progress: 0
            }
          );
          return;
        }

        for (const nft of nfts) {
          await setMetadata(nft, address);
          addressCollection.updateOne(
            { address },
            {
              sync_status: 'progress',
              sync_progress: Math.floor((nfts.indexOf(nft) / nfts.length) * 100)
            }
          );
        }

        await addressCollection.updateOne(
          { address },
          {
            sync_status: 'done',
            sync_progress: 0
          }
        );
      }
    }
  } catch (err) {
    console.error('syncNFTs:', err);
  }
};

module.exports = {
  updateNFTs,
  syncNFTs
};
