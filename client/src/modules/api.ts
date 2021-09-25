import api from '../libs/api';
import { getTokenInfo, getSolanaNFTMetadata, getTokenAccountsByOwner } from "../libs/metaplex/utils";
import { Metadata } from '../libs/metaplex/classes';

const solanaRpcUrl = 'https://black-fragrant-tree.solana-mainnet.quiknode.pro/580c20b14f5a8fb782624bdce35ee63037ee3d3c/';
const TOKEN_PROGRAM_ID = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
const METADATA_PROGRAM_ID = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';

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

export const getSolanaNFTs = async (address: string, offset: number, params: any = {}) => {
  if (params.chain && params.chain.indexOf['solana'] === -1) return {data: []};
  const tokenListRes = await getTokenAccountsByOwner(address);
  const tokenInfoList = tokenListRes.data.result.value.map((token: any) => token.account.data.parsed.info);
  let promiseList: any = [];
  tokenInfoList.forEach((tokenInfo: any) => {
    if (tokenInfo.tokenAmount.amount === '1' && tokenInfo.tokenAmount.decimals === 0) {
      promiseList.push(getTokenInfo(tokenInfo.mint));
    }
  })
  let  NFTsMetadataRes: Metadata[] = await Promise.all(promiseList);
  NFTsMetadataRes.sort((a: Metadata, b: Metadata): number => {
    if (!('direction' in params) || params.direction === 1) {
      return a.data.name < b.data.name? -1: 1;
    }
    else return a.data.name > b.data.name? -1: 1;
  })
  NFTsMetadataRes = NFTsMetadataRes.slice(offset, offset + 12);
  promiseList = []
  NFTsMetadataRes.forEach((metadata: Metadata) => {
    promiseList.push(getSolanaNFTMetadata(metadata))
  })
  const data = await Promise.all(promiseList);
  data.filter(x => x);
  return { data };
}