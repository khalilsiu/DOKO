import api from '../../libs/api';
import openseaApi from '../../libs/opensea-api';

export const getNFTs = (address: string, offset: number, params: any = {}) =>
  api.get(`/collections/${address}/nfts`, {
    params: {
      offset,
      ...params,
    },
  });

export const getCollection = (address: string) => api.get(`/collections/${address}`);

export const getEthNFTs = (asset_contract_address: string, offset: number) =>
  openseaApi.get('/assets', {
    params: {
      offset,
      limit: 12,
      asset_contract_address,
    },
  });

export const getCollectionDetail = async (asset_contract_address: string, token_id: string) => {
  const { data } = await openseaApi.get(`/asset/${asset_contract_address}/${token_id}`);
  return data.collection;
};
