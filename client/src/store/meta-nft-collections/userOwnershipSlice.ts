import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pick } from 'lodash';
import metaverses from '../../constants/metaverses';
import OpenSeaAPI from '../../libs/opensea-api';
import { camelize } from '../../utils/utils';

export interface Trait {
  traitType: string;
  value: string;
}

export interface Asset {
  id: string;
  tokenId: string;
  imageUrl: string;
  imagePreviewUrl: string;
  imageThumbnailUrl: string;
  name: string;
  assetContract: {
    address: string;
  };
  traits: Trait[];
}

export interface UserOwnership {
  // TODO: add type back
  // no count needed, can be inferred from nfts.length
  // price should be another domain not User
  ownerships: Asset[][];
  isLoading: boolean;
}

const initialState: UserOwnership = {
  ownerships: Array(metaverses.length)
    .fill(null)
    .map(() => []),
  isLoading: false,
};

const preprocess = (asset: any): Asset => {
  const picked = pick(asset, [
    'id',
    'token_id',
    'image_url',
    'image_preview_url',
    'image_thumbnail_url',
    'name',
    'asset_contract',
    'traits',
  ]);
  picked.asset_contract = pick(picked.asset_contract, ['address']);
  picked.traits = picked.traits.map((trait) => pick(trait, ['trait_type', 'value']));
  return camelize(picked);
};

export const fetchUserOwnership = createAsyncThunk(
  'UserOwnership/fetchUserOwnership',
  async (address: string) => {
    let assetsFromResponse: any[] = [''];
    let offset = 0;
    const assets: any[] = [];
    const nfts: any[][] = Array(metaverses.length)
      .fill(null)
      .map(() => []);
    while (assetsFromResponse.length) {
      const params = new URLSearchParams();
      params.append('limit', '50');
      params.append('owner', address);
      params.append('offset', offset.toString());
      metaverses
        .flatMap((metaverse) => metaverse.addresses)
        .forEach((contractAddress) => {
          params.append('asset_contract_addresses', contractAddress);
        });
      // eslint-disable-next-line no-await-in-loop
      const response = await OpenSeaAPI.get('/assets', { params });
      assetsFromResponse = response.data.assets;
      assets.push(...assetsFromResponse);
      offset += 50;
    }

    assets.forEach((asset) => {
      if (!asset.asset_contract) {
        return;
      }
      metaverses.forEach((metaverse, index) => {
        // no differentiation within same collection
        if (metaverse.addresses.includes(asset.asset_contract.address)) {
          nfts[index].push(preprocess(asset));
        }
      });
    });
    return nfts;
  },
);

const userOwnershipSlice = createSlice({
  name: 'UserOwnership',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOwnership.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserOwnership.fulfilled, (state, action) => {
        state.ownerships = action.payload;
        state.isLoading = false;
      });
  },
});

// export const { getUserOwnership } = userOwnershipSlice.actions;

export const userOwnership = userOwnershipSlice.reducer;
