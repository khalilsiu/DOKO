import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import metaverses from '../../constants/metaverses';
import { AddressOwnership } from './profileOwnershipSlice';
import { fetchAssets } from './utils';

const initialState: AddressOwnership = {
  assets: Array(metaverses.length)
    .fill(null)
    .map(() => []),
  address: '',
};

export const fetchAddressOwnership = createAsyncThunk(
  'AddressOwnership/fetchAddressOwnership',
  async (address: string) => ({
    address,
    assets: await fetchAssets(address),
  }),
);

const addressOwnershipSlice = createSlice({
  name: 'AddressOwnership',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAddressOwnership.fulfilled, (state, action) => ({
      ...state,
      ...action.payload,
    }));
  },
});

// export const { getUserOwnership } = addressOwnershipSlice.actions;

export const addressOwnership = addressOwnershipSlice.reducer;
