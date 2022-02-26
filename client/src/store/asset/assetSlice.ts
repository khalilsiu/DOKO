import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ContractServiceAPI from '../../libs/contract-service-api';
import OpenSeaAPI from '../../libs/opensea-api';
import { camelize } from '../../utils/utils';
import { Asset, preprocess } from '../summary';

const initialState: Asset = {
  floorPrice: 0,
  id: '',
  tokenId: '',
  imageUrl: '',
  imageOriginalUrl: '',
  coordinates: [0, 0],
  imagePreviewUrl: '',
  imageThumbnailUrl: '',
  name: '',
  assetContract: {
    address: '',
  },
  traits: [],
};

interface IGetAsset {
  contractAddress: string;
  assetId: string;
}

export const getAssetFromOpensea = createAsyncThunk(
  'Asset/getAssetFromOpensea',
  async (payload: IGetAsset) => {
    const response = await OpenSeaAPI.get(`/asset/${payload.contractAddress}/${payload.assetId}`);
    // ... TODO GET FLOOR PRICE FROM BACKEND
    const asset = preprocess(response.data);
    return camelize(asset);
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
    builder.addCase(getAsset.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

// export const { getUserOwnership } = assetSlice.actions;

export const asset = assetSlice.reducer;
