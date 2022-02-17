import api from '../libs/api';

export const getNFTs = (address: string, offset: number, params: any = {}) =>
  api.get('/nfts', {
    params: {
      address,
      offset,
      ...params,
    },
  });

export const indexAddress = (address: string, reindex = false) =>
  api.post('/nfts/index', {
    address,
    reindex,
  });

export const getAddressStatus = (address: string) => api.get(`/address/${address}`);

export const getNFT = (address: string, id: string) => api.get(`/nft/${address}/${id}`);

export const fetchOpenseaEvents = (address: string, id: string, offset: number, limit: number) =>
  api.get(`/nft/eth/events/${address}/${id}/${offset}/${limit}`);

export const fetchOpenseaLastSale = (address: string, id: string) =>
  api.get(`/nft/eth/lastsale/${address}/${id}`);
