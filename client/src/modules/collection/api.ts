import api from '../../libs/api';

export const getNFTs = (address: string, offset: number, params: any = {}) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  api.get(`/collections/${address}/nfts`, {
    params: {
      offset,
      ...params,
    },
  });

export const getCollection = (address: string) => api.get(`/collections/${address}`);
