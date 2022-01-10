import OpenSeaAPI from '../../libs/opensea-api';
import api from '../../libs/api';
// import { getSolanaNFTMetadata } from '../../libs/metaplex/utils';

export const getEthAssets = (owner: string, offset: number, collection = '') =>
  OpenSeaAPI.get('/assets', {
    params: {
      owner,
      offset,
      limit: 12,
      ...(collection ? { collection } : {}),
    },
  })
    .then((res) => res.data)
    .catch((err) => {
      console.error(err);
      return {};
    });

export const getNFTsCount = (owner: string) => api.get(`/nfts/${owner}/count`);

export const getAllEthAssets = async (owner: string) => {
  let nfts: any[] = [];

  while (1) {
    const {
      data: { assets },
    } = await OpenSeaAPI.get('/assets', {
      params: {
        owner,
        limit: 50,
        offset: nfts.length,
      },
    });
    nfts = nfts.concat(assets);

    if (assets.length < 50) {
      break;
    }
  }
  return nfts;
};

export const getEthCollections = async (asset_owner: string) => {
  const { data: collections } = await OpenSeaAPI.get('/collections', {
    params: {
      limit: 300,
      asset_owner,
    },
  });
  return collections;
};

export const getFloorPrice = async (asset_owner: string) => {
  const collections = await getEthCollections(asset_owner);

  const floorPrice = collections.reduce((sum: number, c: any) => sum + c.stats.floor_price, 0);
  return floorPrice;
};

export default getEthAssets;
