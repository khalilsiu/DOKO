import { createAsyncThunk } from '@reduxjs/toolkit';
import metaverses from 'constants/metaverses';
import ContractServiceAPI from 'libs/contract-service-api';
import { web3 } from 'libs/web3';
import { fetchOpenseaLastSale } from 'modules/api';
import { parsePrice } from 'store/summary';
import { fetchNFTOpensea } from './api';
import { FetchEthereumParams, NFT, Trait } from './types';

const getMetaverseName = (slug: string): string | null => {
  switch (slug) {
    case 'decentraland':
      return 'Decentraland';

    case 'cryptovoxels':
      return 'Cryptovoxels';

    case 'somnium-space':
      return 'Somnium Space';

    case 'sandbox':
      return 'The Sandbox';

    default:
      return null;
  }
};

const fetchMetaverseFloorPrice = async (nftData: any) => {
  const metaverse = metaverses.find((metaverse) => nftData.collection.slug === metaverse.slug);
  if (!metaverse) {
    return null;
  }

  const traits = nftData.traits?.length ? nftData.traits : [];

  const lookupTraits = traits.filter((trait) =>
    metaverse.primaryTraitTypes.includes(trait.trait_type),
  );

  const traitFilter = lookupTraits.map((trait) => ({
    traitType: trait.trait_type,
    value: trait.value,
    operator: '=',
  }));

  const response = await ContractServiceAPI.getAssetFloorPrice(
    metaverse.primaryAddress,
    traitFilter,
  );

  let floorPrice = parsePrice(response.price, response.payment_token);

  if (nftData.asset_contract.address === '0x959e104e1a4db6317fa58f8295f586e1a978c297') {
    const sizeTrait = nftData.traits.find((trait) => trait.trait_type === 'Size');
    const size = parseInt((sizeTrait && sizeTrait.value) || '1', 10);
    floorPrice *= size;
  }

  return floorPrice;
};

const fetchMetaverseLastPurchasePrice = async (
  address: string,
  tokenId: string,
): Promise<[number | null, number | null]> => {
  try {
    const response = await fetchOpenseaLastSale(address, tokenId);
    const isLastSale = response.data.last_sale && response.data.last_sale.total_price;
    const ethAmount = isLastSale
      ? +web3.utils.fromWei(response.data.last_sale.total_price, 'ether')
      : 0;
    const usdRate = isLastSale ? +response.data.last_sale.payment_token.usd_price : 0;
    let usdAmount = ethAmount * usdRate;
    usdAmount = +Number.parseFloat(usdAmount.toString()).toFixed(2);

    return [ethAmount, usdAmount];
  } catch (e) {
    console.error(e);
    return [null, null];
  }
};

const fetchEthereumNFT = async ({ address, id }: FetchEthereumParams): Promise<NFT> => {
  const res = await fetchNFTOpensea(address, id);
  const nftData = res.data;

  const traits: Trait[] = (res.data.traits?.length ? res.data.traits : []).map((_) => ({
    type: _.trait_type,
    value: _.value,
  }));

  const floorPrice = await fetchMetaverseFloorPrice(nftData);
  const [lastPurchasePriceETH, lastPurchasePriceUSD] = await fetchMetaverseLastPurchasePrice(
    address,
    id,
  );

  return {
    traits,
    floorPrice,
    lastPurchasePriceETH,
    lastPurchasePriceUSD,
    tokenId: id,
    contractAddress: address,
    name: nftData.name,
    ownerAddress: nftData.owner.address,
    creatorAddress: nftData.creator.address,
    imageURL: nftData.image_url,
    description: nftData.description,
    collection: nftData.asset_contract?.name,
    tokenStandard: nftData.asset_contract?.schema_name,
    slug: nftData.collection?.slug,
    metaverseName: getMetaverseName(nftData.collection?.slug),
    externalLink: nftData.external_link,
  };
};

export const fetchNFT = createAsyncThunk(
  'metaNFTIndividual/fetchNFT',
  async ({ address, id }: FetchEthereumParams): Promise<NFT> => {
    return fetchEthereumNFT({ address, id });
  },
);
