import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import OpenSeaAPI from '../../libs/opensea-api';
import { Asset, preprocess } from './profileOwnershipSlice';
import { parsePrice } from './collectionSummarySlice';
import ContractServiceAPI from '../../libs/contract-service-api';

const initialState: Asset = {
  floorPrice: 0,
  lastSale: 0,
  id: 'N/A',
  collection: 'N/A',
  tokenId: 'N/A',
  owner: 'N/A',
  creator: 'N/A',
  description: 'N/A',
  externalLink: 'N/A',
  imageUrl: 'N/A',
  imageOriginalUrl: 'N/A',
  coordinates: [0, 0],
  imagePreviewUrl: 'N/A',
  imageThumbnailUrl: 'N/A',
  name: 'N/A',
  assetContract: {
    address: 'N/A',
    schemaName: 'N/A',
  },
  traits: [],
};

export const fetchSingleAsset = async (asset_contract_address: string, token_id: string) => {
  const response = await OpenSeaAPI.get(`/asset/${asset_contract_address}/${token_id}`);
  const assetFromResponse = response.data;
  const asset = preprocess(assetFromResponse);
  const filter = asset.traits.map((trait) => ({
    traitType: trait.traitType,
    value: trait.value,
    operator: '=',
  }));
  const floorPriceFromResponse = await ContractServiceAPI.getAssetFloorPrice(
    asset.assetContract.address,
    filter,
  );

  asset.floorPrice = parsePrice(floorPriceFromResponse.price, floorPriceFromResponse.payment_token);
  asset.lastSale = parsePrice(
    assetFromResponse.last_sale.total_price,
    assetFromResponse.last_sale.payment_token,
  );
  return asset;
};

export const fetchAsset = createAsyncThunk(
  'Asset/fetchSingleAsset',
  async ({
    asset_contract_address,
    token_id,
  }: {
    asset_contract_address: string;
    token_id: string;
  }) => await fetchSingleAsset(asset_contract_address, token_id),
);

const assetSlice = createSlice({
  name: 'SingleAsset',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAsset.fulfilled, (state, action) => ({
      ...state,
      ...action.payload,
    }));
  },
});

export const singleAsset = assetSlice.reducer;
