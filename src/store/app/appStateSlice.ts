import { Color } from '@material-ui/lab';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchAddressOwnership } from 'store/address/addressOwnershipSlice';
import { fetchParcelTransactionHistory } from 'store/asset/parcelTransactionHistorySlice';
import { fetchProfileOwnership } from 'store/profile/profileOwnershipSlice';
import { getDclStats } from 'store/stats/dclStatsSlice';
import { getAssetFromOpensea } from '../asset/assetSlice';
import { acceptLease, upsertLease, landlordTerminate, payRent } from '../lease/leasesSlice';

export type ToastAction = 'refresh' | 'install-metamask';
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
        message,
        show: true,
        state: toastState,
        action: toastAction,
      };
    },
    closeToast(state) {
      state.toast = {
        ...state.toast,
        show: false,
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

      .addCase(upsertLease.pending, (state) => {
        state.isTransacting = true;
      })
      .addCase(upsertLease.fulfilled, (state) => {
        state.isTransacting = false;
      })
      .addCase(upsertLease.rejected, (state, action) => {
        state.isTransacting = false;
        state.toast = {
          show: true,
          state: 'error',
          message: (action.payload && action.payload.error) || action.error.message,
        };
      })

      .addCase(acceptLease.pending, (state) => {
        state.isTransacting = true;
      })
      .addCase(acceptLease.fulfilled, (state) => {
        state.isTransacting = false;
      })
      .addCase(acceptLease.rejected, (state, action) => {
        state.isTransacting = false;
        state.toast = {
          show: true,
          state: 'error',
          message: action.payload ? action.payload.error : action.error.message,
        };
      })

      .addCase(payRent.pending, (state) => {
        state.isTransacting = true;
      })
      .addCase(payRent.fulfilled, (state) => {
        state.isTransacting = false;
      })
      .addCase(payRent.rejected, (state, action) => {
        state.isTransacting = false;
        state.toast = {
          show: true,
          state: 'error',
          message: action.payload ? action.payload.error : action.error.message,
        };
      })

      .addCase(landlordTerminate.pending, (state) => {
        state.isTransacting = true;
      })
      .addCase(landlordTerminate.fulfilled, (state) => {
        state.isTransacting = false;
      })
      .addCase(landlordTerminate.rejected, (state, action) => {
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

      .addCase(getDclStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDclStats.fulfilled, (state) => {
        state.isLoading = false;
      })
      // fulfilled
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
