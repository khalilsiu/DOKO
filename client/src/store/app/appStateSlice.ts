import { createSlice } from '@reduxjs/toolkit';
import { fetchProfileOwnership } from '../meta-nft-collections';
import { fetchAddressOwnership } from '../meta-nft-collections/addressOwnershipSlice';
import { getDclStats } from '../stats/dclStatsSlice';

const initialState = {
  isLoading: false,
};

const appStateSlice = createSlice({
  name: 'AppState',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddressOwnership.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfileOwnership.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(fetchAddressOwnership.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(getDclStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDclStats.fulfilled, (state) => {
        state.isLoading = false;
      })
      // fulfilled
      .addCase(fetchProfileOwnership.fulfilled, (state) => {
        state.isLoading = false;
      });
  },
});

// export const { getUserOwnership } = appStateSlice.actions;

export const appState = appStateSlice.reducer;
