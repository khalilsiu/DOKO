import api from '../libs/api';

export const getNFTs = (address: string, offset: number, params: any = {}) =>
  api.get('/nfts', {
    params: {
      address,
      offset,
      ...params
    }
  });

export const indexAddress = (address: string) =>
  api.post('/nfts/index', {
    address
  });

export const getAddressStatus = (address: string) => api.get(`/address/${address}`);
