import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import metaverses from 'constants/metaverses';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import ContractServiceAPI from '../../libs/contract-service-api';
import OpenSeaAPI from '../../libs/opensea-api';
import { camelize } from '../../utils/utils';
import { Asset, parsePrice, preprocess } from '../summary';

interface AssetSliceState {
  asset: Asset;
  fetching: boolean;
}

const initialState: AssetSliceState = {
  fetching: false,
  asset: {
    floorPrice: 0,
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
    metaverseName: null,
    collection: null,
    tokenStandard: null,
    slug: null,
    externalLink: null,
    lastPurchasePriceETH: null,
    lastPurchasePriceUSD: null,
  },
};

interface IGetAsset {
  contractAddress: string;
  assetId: string;
}

export const useAssetSliceSelector = <T>(func: (state: RootState['asset']) => T) =>
  useSelector((state: RootState) => func(state.asset));

const fetchMetaverseFloorPrice = async (asset: Asset) => {
  const metaverse = metaverses.find((metaverse) => asset.slug === metaverse.slug);
  if (!metaverse) {
    return null;
  }

  const traits = asset.traits?.length ? asset.traits : [];

  const lookupTraits = traits.filter((trait) =>
    metaverse.primaryTraitTypes.includes(trait.traitType),
  );

  const traitFilter = lookupTraits.map((trait) => ({
    traitType: trait.traitType,
    value: trait.value,
    operator: '=',
  }));

  const response = await ContractServiceAPI.getAssetFloorPrice(
    metaverse.primaryAddress,
    traitFilter,
  );

  let floorPrice = parsePrice(response.price, response.payment_token);

  if (asset.assetContract.address === '0x959e104e1a4db6317fa58f8295f586e1a978c297') {
    const sizeTrait = asset.traits.find((trait) => trait.traitType === 'Size');
    const size = parseInt((sizeTrait && sizeTrait.value) || '1', 10);
    floorPrice *= size;
  }

  return floorPrice;
};

const fetchNFTOpensea = async (address: string, id: string) =>
  OpenSeaAPI.get(`/asset/${address}/${id}`);

export const getAssetFromOpensea = createAsyncThunk(
  'Asset/getAssetFromOpensea',
  async ({ contractAddress, assetId }: IGetAsset) => {
    try {
      const response = await fetchNFTOpensea(contractAddress, assetId);
      const asset = preprocess(response.data);
      const lease = await ContractServiceAPI.getLease({ contractAddress, assetId });
      const floorPrice = await fetchMetaverseFloorPrice(asset);

      return camelize({ ...asset, lease, floorPrice });
    } catch (e) {
      console.error(e);
    }
  },
);

export const getAsset = createAsyncThunk('Asset/getAsset', async (payload: any) => {
  const response = await OpenSeaAPI.get(`/asset/${payload.contractAddress}/${payload.assetId}`);
  const asset = preprocess(response.data);
  const lease = await ContractServiceAPI.getLease(payload);

  return camelize({ ...asset, lease });
});

const assetSlice = createSlice({
  name: 'Asset',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAsset.fulfilled, (state, action) => {
        state.fetching = false;
        state.asset = action.payload;
      })
      .addCase(getAssetFromOpensea.pending, (state) => {
        state.fetching = true;
      })
      .addCase(getAssetFromOpensea.fulfilled, (state, action) => {
        state.fetching = true;
        state.asset = action.payload;
      })
      .addCase(getAssetFromOpensea.rejected, (state) => {
        state.fetching = false;
      });
  },
});

// export const { getUserOwnership } = assetSlice.actions;

export const asset = assetSlice.reducer;
