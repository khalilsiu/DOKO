import { Color } from '@material-ui/lab';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAsset, getAssetFromOpensea } from '../asset/assetSlice';
import { upsertLeaseToBlockchain } from '../lease/leasesSlice';
import { fetchProfileOwnership } from '../summary';
import { fetchAddressOwnership } from '../summary/addressOwnershipSlice';

export type ToastAction = 'refresh';
interface AppState {
  isLoading: boolean;
  isTransacting: boolean;
  toast: {
    show: boolean;
    state?: Color;
    message?: string;
    action?: ToastAction;
  };
}

const initialState: AppState = {
  isLoading: false,
  isTransacting: false,
  toast: {
    show: false,
  },
};

const appStateSlice = createSlice({
  name: 'AppState',
  initialState,
  reducers: {
    openToast(
      state,
      action: PayloadAction<{ message: string; state: Color; action?: ToastAction }>,
    ) {
      const { state: toastState, message, action: toastAction } = action.payload;
      state.toast = {
        show: true,
        state: toastState,
        message,
        action: toastAction,
      };
    },
    closeToast(state) {
      state.toast = {
        show: false,
        state: undefined,
        message: undefined,
        action: undefined,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // pending
      .addCase(fetchAddressOwnership.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(upsertLeaseToBlockchain.pending, (state) => {
        state.isTransacting = true;
      })
      .addCase(fetchProfileOwnership.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAsset.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAssetFromOpensea.pending, (state) => {
        state.isLoading = true;
      })
      // fulfilled
      .addCase(fetchAddressOwnership.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchProfileOwnership.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(upsertLeaseToBlockchain.fulfilled, (state) => {
        state.isTransacting = false;
      })
      .addCase(getAsset.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(getAssetFromOpensea.fulfilled, (state) => {
        state.isLoading = false;
      })
      // rejected
      .addCase(upsertLeaseToBlockchain.rejected, (state, action) => {
        state.isTransacting = false;
        state.toast = {
          show: true,
          state: 'error',
          message: action.error.message,
        };
      });
  },
});

export const { closeToast, openToast } = appStateSlice.actions;
export const appState = appStateSlice.reducer;
