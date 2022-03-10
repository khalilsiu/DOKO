import { Color } from '@material-ui/lab';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchParcelTransactionHistory } from 'store/asset/parcelTransactionHistorySlice';
<<<<<<< HEAD:src/store/app/appStateSlice.ts
import { fetchProfileOwnership } from 'store/summary/profileOwnershipSlice';
=======
import { getDclStats } from 'store/stats/dclStatsSlice';
>>>>>>> e262d56dc533d3f974edd4102923ae9253e8d5e0:client/src/store/app/appStateSlice.ts
import { getAssetFromOpensea } from '../asset/assetSlice';
import { acceptLeaseToBlockchain, upsertLeaseToBlockchain } from '../lease/metaverseLeasesSlice';
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
    startLoading(state) {
      state.isLoading = true;
    },
    stopLoading(state) {
      state.isLoading = false;
    },
    openToast(
      state,
      action: PayloadAction<{
        message: string;
        state: Color;
        action?: ToastAction;
      }>,
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
      .addCase(fetchAddressOwnership.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAddressOwnership.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAddressOwnership.rejected, (state, action) => {
        state.isLoading = false;
        state.toast = {
          show: true,
          state: 'error',
          message: action.error.message,
        };
      })

      .addCase(upsertLeaseToBlockchain.pending, (state) => {
        state.isTransacting = true;
      })
      .addCase(upsertLeaseToBlockchain.fulfilled, (state) => {
        state.isTransacting = false;
      })
      .addCase(upsertLeaseToBlockchain.rejected, (state, action) => {
        state.isTransacting = false;
        state.toast = {
          show: true,
          state: 'error',
          message: (action.payload && action.payload.error) || action.error.message,
        };
      })

      .addCase(acceptLeaseToBlockchain.pending, (state) => {
        state.isTransacting = true;
      })
      .addCase(acceptLeaseToBlockchain.fulfilled, (state) => {
        state.isTransacting = false;
      })
      .addCase(acceptLeaseToBlockchain.rejected, (state, action) => {
        state.isTransacting = false;
        state.toast = {
          show: true,
          state: 'error',
          message: action.payload ? action.payload.error : action.error.message,
        };
      })

      .addCase(fetchProfileOwnership.pending, (state) => {
        state.isLoading = true;
      })
<<<<<<< HEAD:src/store/app/appStateSlice.ts
=======
      .addCase(getAssetFromOpensea.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDclStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDclStats.fulfilled, (state) => {
        state.isLoading = false;
      })
      // fulfilled
>>>>>>> e262d56dc533d3f974edd4102923ae9253e8d5e0:client/src/store/app/appStateSlice.ts
      .addCase(fetchProfileOwnership.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchProfileOwnership.rejected, (state, action) => {
        state.isLoading = false;
        state.toast = {
          show: true,
          state: 'error',
          message: action.error.message,
        };
      })

      .addCase(getAssetFromOpensea.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAssetFromOpensea.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(getAssetFromOpensea.rejected, (state, action) => {
        state.isLoading = false;
        state.toast = {
          show: true,
          state: 'error',
          message: action.error.message,
        };
      })

      .addCase(fetchParcelTransactionHistory.rejected, (state, action) => {
        state.toast = {
          show: true,
          state: 'error',
          message: action.error.message,
        };
      });
  },
});

export const { closeToast, openToast, startLoading, stopLoading } = appStateSlice.actions;
export const appState = appStateSlice.reducer;
