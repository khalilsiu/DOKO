import OpenSeaAPI from '../../libs/opensea-api';
import api from '../../libs/api';

export const getEthAssets = (owner: string, offset: number) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  OpenSeaAPI.get('/assets', {
    params: {
      owner,
      offset,
      limit: 12,
    },
  })
    .then((res) => res.data)
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      return {};
    });

export const getNFTsCount = (owner: string) => api.get(`/nfts/${owner}/count`);

export const getAllEthAssets = async (owner: string) => {
  let nfts: any[] = [];

  // eslint-disable-next-line no-constant-condition
  while (1) {
    const {
      data: { assets },
      // eslint-disable-next-line no-await-in-loop
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

export default getEthAssets;
