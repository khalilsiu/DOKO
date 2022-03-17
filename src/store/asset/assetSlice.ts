import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import metaverses from 'constants/metaverses';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { parsePriceETH, parsePriceUSD } from 'store/summary/metaverseSummary';
import { Asset } from 'store/summary/profileOwnershipSlice';
import { processAssetFromOpensea } from 'store/summary/utils';
import ContractServiceAPI from '../../libs/contract-service-api';
import OpenSeaAPI from '../../libs/opensea-api';
import { camelize } from '../../utils/utils';

import { preprocessAssetFromServer } from './metaverseAssetsFromServerSlice';

const initialState: Asset = {
  id: '',
  tokenId: '',
  imageUrl: '',
  imageOriginalUrl: '',
  coordinates: [0, 0],
  imagePreviewUrl: '',
  imageThumbnailUrl: '',
  name: '',
  description: '',
  ownerAddress: '',
  creatorAddress: '',
  assetContract: {
    address: '',
  },
  traits: [],
  metaverseName: '',
  collection: '',
  tokenStandard: '',
  slug: '',
  externalLink: '',
  lastPurchasePriceEth: 0,
  lastPurchasePriceUsd: 0,
  floorPriceInUsd: 0,
  floorPriceInEth: 0,
};

interface IGetAsset {
  contractAddress: string;
  tokenId: string;
}

export const useAssetSliceSelector = <T>(func: (state: RootState['asset']) => T) =>
  useSelector((state: RootState) => func(state.asset));

const fetchMetaverseFloorPrice = async (asset: Asset): Promise<[number | null, number | null]> => {
  try {
    const metaverse = metaverses.find((metaverse) => asset.slug === metaverse.slug);
    if (!metaverse) {
      return [0, 0];
    }

    const traits = asset.traits?.length ? asset.traits : [];

    const lookupTraits = traits.filter((trait) => (metaverse.primaryTraitTypes as string[]).includes(trait.traitType));

    const traitFilter = lookupTraits.map((trait) => ({
      traitType: trait.traitType,
      value: trait.value,
      operator: '=',
    }));

    const response = await ContractServiceAPI.getAssetFloorPrice(metaverse.primaryAddress, traitFilter);

    let floorPriceETH = parsePriceETH(response.price, response.payment_token);
    let floorPriceUSD = parsePriceUSD(response.price, response.payment_token);

    if (asset.assetContract.address === '0x959e104e1a4db6317fa58f8295f586e1a978c297') {
      const sizeTrait = asset.traits.find((trait) => trait.traitType === 'Size');
      const size = parseInt((sizeTrait && sizeTrait.value) || '1', 10);
      floorPriceETH *= size;
      floorPriceUSD *= size;
    }

    return [floorPriceETH, floorPriceUSD];
  } catch (e) {
    return [null, null];
  }
};
const fetchNFTOpensea = async (address: string, id: string) => OpenSeaAPI.get(`/asset/${address}/${id}`);

export const getAssetFromOpensea = createAsyncThunk(
  'Asset/getAssetFromOpensea',
  async ({ contractAddress, tokenId }: IGetAsset) => {
    try {
      const response = await fetchNFTOpensea(contractAddress, tokenId);
      const asset = processAssetFromOpensea(response.data);
      const assetWithLease = await ContractServiceAPI.getLease({
        contractAddress,
        tokenId,
      });
      const [floorPriceInEth, floorPriceInUsd] = await fetchMetaverseFloorPrice(asset);

      return camelize({
        ...asset,
        lease: assetWithLease.lease,
        floorPriceInEth,
        floorPriceInUsd,
      });
    } catch (e) {
      console.error(e);
    }
  },
);

export const getAssetFromServer = createAsyncThunk('Asset/getAssetFromServer', async (payload: IGetAsset) => {
  const leaseWithAsset = await ContractServiceAPI.getLease(payload);
  return preprocessAssetFromServer(leaseWithAsset);
});

const assetSlice = createSlice({
  name: 'Asset',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAssetFromOpensea.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(getAssetFromServer.fulfilled, (state, action) => {
        return action.payload;
      });
  },
});

// export const { getUserOwnership } = assetSlice.actions;

export const asset = assetSlice.reducer;
