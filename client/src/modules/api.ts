import api from '../libs/api';

export const getNFTs = (address: string, offset: number, params: any = {}) =>
  api.get('/nfts', {
    params: {
      address,
      offset,
      ...params
    }
  });

export const indexAddress = (address: string, reindex = false) =>
  api.post('/nfts/index', {
    address,
    reindex
  });

export const getAddressStatus = (address: string) => api.get(`/address/${address}`);
