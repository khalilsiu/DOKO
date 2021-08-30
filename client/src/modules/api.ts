import api from '../libs/api';

export const getNFTs = (address: string, offset: number) =>
  api.get('/nfts', {
    params: {
      address,
      offset
    }
  });

export const indexAddress = (address: string) =>
  api.post('/nfts/index', {
    address
  });
