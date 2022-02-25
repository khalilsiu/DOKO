import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ContractServiceAPI from '../../libs/contract-service-api';
import OpenSeaAPI from '../../libs/opensea-api';
import { camelize } from '../../utils/utils';
import { Asset, preprocess } from '../summary';
import { preprocessAssetFromServer } from './metaverseAssetsFromServerSlice';

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
    const asset = preprocess(response.data);
    const leaseWithAsset = await ContractServiceAPI.getLease(payload);
    return camelize({ ...asset, lease: leaseWithAsset.lease });
  },
);

export const getAssetFromServer = createAsyncThunk(
  'Asset/getAssetFromServer',
  async (payload: IGetAsset) => {
    const leaseWithAsset = await ContractServiceAPI.getLease(payload);
    return preprocessAssetFromServer(leaseWithAsset);
  },
);

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
