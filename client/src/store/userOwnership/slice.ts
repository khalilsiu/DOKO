import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import metaverses from '../../constants/metaverses';
import OpenSeaAPI from '../../libs/opensea-api';

export interface UserOwnership {
  // TODO: add type back
  // no count needed, can be inferred from nfts.length
  // price should be another domain not User
  ownerships: any[][];
  isLoading: boolean;
}

const initialState: UserOwnership = {
  ownerships: Array(metaverses.length).fill([]),
  isLoading: false,
};

export const fetchUserOwnership = createAsyncThunk(
  'todos/fetchUserOwnership',
  async (address: string) => {
    let assetsFromResponse: any[] = [''];
    let offset = 0;
    const assets: any[] = [];
    const nfts = Array(metaverses.length).fill([]);
    while (assetsFromResponse.length) {
      // eslint-disable-next-line no-await-in-loop
      const response = await OpenSeaAPI.get('/assets', {
        params: {
          limit: 50,
          owner: address,
          offset,
          asset_contract_addresses: metaverses.flatMap((metaverse) => metaverse.addresses),
        },
      });
      assetsFromResponse = response.data.assets;
      assets.push(...assetsFromResponse);
      offset += 50;
    }
    assets.forEach((asset) => {
      if (!asset.asset_contract) {
        return;
      }
      metaverses.forEach((metaverse, index) => {
        // no differentiation between same collection
        if (metaverse.addresses.includes(asset.asset_contract.address)) {
          nfts[index].push(asset);
        }
      });
    });
    return nfts;
  },
);

const userOwnershipSlice = createSlice({
  name: 'UserOwnership',
  initialState,
  reducers: {
    getUserOwnership(state, action) {
      state = action.payload;
    },
  },
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

export const { getUserOwnership } = userOwnershipSlice.actions;

export default userOwnershipSlice.reducer;
