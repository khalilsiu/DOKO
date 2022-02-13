import { Color } from '@material-ui/lab';
import { createSlice } from '@reduxjs/toolkit';
import { createLeaseToBlockchain } from '../lease/leaseSlice';
import { fetchProfileOwnership } from '../meta-nft-collections';
import { fetchAddressOwnership } from '../meta-nft-collections/addressOwnershipSlice';

interface AppState {
  isLoading: boolean;
  isTransacting: boolean;
  toast: {
    show: boolean;
    state: Color | undefined;
    message?: string;
  };
}

const initialState: AppState = {
  isLoading: false,
  isTransacting: false,
  toast: {
    show: false,
    state: undefined,
    message: undefined,
  },
};

const appStateSlice = createSlice({
  name: 'AppState',
  initialState,
  reducers: {
    closeToast(state) {
      state.toast = {
        show: false,
        state: undefined,
        message: undefined,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // pending
      .addCase(fetchAddressOwnership.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createLeaseToBlockchain.pending, (state) => {
        state.isTransacting = true;
      })
      .addCase(fetchProfileOwnership.pending, (state) => {
        state.isLoading = true;
      })
      // fulfilled
      .addCase(fetchAddressOwnership.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchProfileOwnership.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createLeaseToBlockchain.fulfilled, (state) => {
        state.isTransacting = false;
      })
      // rejected
      .addCase(createLeaseToBlockchain.rejected, (state, action) => {
        state.isTransacting = false;
        console.log('ERRR', action.error);
        state.toast = {
          show: true,
          state: 'error',
          message: action.error.message,
        };
      });
  },
});

export const { closeToast } = appStateSlice.actions;
export const appState = appStateSlice.reducer;
