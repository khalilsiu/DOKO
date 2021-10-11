import { getTokenInfo, getSolanaNFTMetadata, getTokenAccountsByOwner } from './metaplex/utils';
import { Metadata } from './metaplex/classes';

const getSolNfts = async (address: string, offset: number, params: any = {}) => {
  if (params.chain && params.chain.indexOf.solana === -1) return { data: [] };
  const tokenListRes = await getTokenAccountsByOwner(address);
  const tokenInfoList = tokenListRes.data.result.value
    .map((token: any) => token.account.data.parsed.info);
  let promiseList: any[] = [];
  tokenInfoList.forEach((tokenInfo: any) => {
    if (tokenInfo.tokenAmount.amount === '1' && tokenInfo.tokenAmount.decimals === 0) {
      promiseList.push(getTokenInfo(tokenInfo.mint));
    }
  });
  let NFTsMetadataRes: Metadata[] = await Promise.all(promiseList);
  NFTsMetadataRes.sort((a: Metadata, b: Metadata): number => {
    if (!('direction' in params) || params.direction === 1) {
      return a.data.name < b.data.name ? -1 : 1;
    }
    return a.data.name > b.data.name ? -1 : 1;
  });
  NFTsMetadataRes = NFTsMetadataRes.slice(offset, offset + 12);
  promiseList = [];
  NFTsMetadataRes.forEach((metadata: Metadata) => {
    promiseList.push(getSolanaNFTMetadata(metadata));
  });
  const nfts = await Promise.all(promiseList);
  const data = nfts.filter((x) => x).map((value: any) => ({
    _id: value.mint,
    name: value.metadata.data.name,
    symbol: value.metadata.data.symbol,
    owner_of: address,
    chain: 'solana',
    metadata: value.metadata.data,
  }));
  return { data };
};

export default getSolNfts;
