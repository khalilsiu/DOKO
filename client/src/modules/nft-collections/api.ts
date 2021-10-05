import OpenSeaAPI from '../../libs/opensea-api';

export const getEthAssets = (owner: string, offset: number, order_direction: 'asc' | 'desc') =>
  // eslint-disable-next-line implicit-arrow-linebreak
  OpenSeaAPI.get('/assets', {
    params: {
      owner,
      offset,
      limit: 12,
      order_direction,
    },
  })
    .then((res) => res.data)
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      return {};
    });

export default getEthAssets;
