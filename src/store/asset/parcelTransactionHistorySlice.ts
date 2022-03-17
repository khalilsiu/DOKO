import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import OpenSeaAPI from '../../libs/opensea-api';
import { minimizeAddress } from '../../utils/utils';

export type ParcelTransactionHistoryCategory = 'sales' | 'bids' | 'transfers';

export interface ParcelTransactionHistory {
  fromAddress: string | null;
  toAddress: string | null;
  price: string | null;
  parcel: string;
  time: string;
  imageURL: string | null;
}

interface ParcelTransactionHistoryState {
  fetchCalled: boolean;
  fetching: boolean;
  currentTab: ParcelTransactionHistoryCategory;
  limit: number;
  result: ParcelTransactionHistory[];
  nextCursor: string | null;
}

interface FetchParcelTransactionHistoryParams {
  contractAddress: string;
  assetId: string;
  refetch?: boolean;
}

const initialState: ParcelTransactionHistoryState = {
  currentTab: 'sales',
  limit: 5,
  result: [],
  fetchCalled: false,
  fetching: false,
  nextCursor: null,
};

export const parcelTransactionHistoryEventMap: Record<ParcelTransactionHistoryCategory, string> = {
  sales: 'successful',
  bids: 'created',
  transfers: 'transfer',
};

const parseResponseAsParcelTransactionHistories = (
  currentTab: ParcelTransactionHistoryCategory,
  response: any,
): ParcelTransactionHistory[] => {
  const formatAddress = (address: string | null) => {
    return address ? minimizeAddress(address) : 'Unknown';
  };

  const formatPrice = (price: string | null, decimals: number) => {
    return price ? parseFloat(String(Number(price) / Math.pow(10, decimals))).toFixed(2) : null;
  };

  return response.data.asset_events.map((assetEvent): ParcelTransactionHistory => {
    switch (currentTab) {
      case 'sales':
        return {
          fromAddress: formatAddress(assetEvent?.seller?.address),
          toAddress: formatAddress(assetEvent?.winner_account?.address),
          price: formatPrice(assetEvent?.total_price, assetEvent?.payment_token?.decimals),
          parcel: assetEvent?.asset?.name || null,
          time: assetEvent?.created_date,
          imageURL: assetEvent?.payment_token?.image_url || null,
        };
      case 'bids':
        return {
          fromAddress: formatAddress(assetEvent?.from_account?.address),
          toAddress: null,
          price: formatPrice(assetEvent?.bid_amount, assetEvent?.payment_token?.decimals),
          parcel: assetEvent?.asset?.name || null,
          time: assetEvent?.created_date,
          imageURL: assetEvent?.payment_token?.image_url || null,
        };
      case 'transfers':
        return {
          fromAddress: formatAddress(assetEvent?.from_account?.address),
          toAddress: formatAddress(assetEvent?.to_account?.address),
          price: formatPrice(assetEvent?.bid_amount, assetEvent?.payment_token?.decimals),
          parcel: assetEvent?.asset?.name || null,
          time: assetEvent?.created_date,
          imageURL: assetEvent?.payment_token?.image_url || null,
        };
    }
  });
};

export const fetchParcelTransactionHistory = createAsyncThunk(
  'ParcelTransactionHistory/fetch',
  async ({ contractAddress, assetId, refetch }: FetchParcelTransactionHistoryParams, thunkAPI) => {
    const { limit, currentTab, nextCursor } = (thunkAPI.getState() as RootState).parcelTransactionHistory;
    const address = contractAddress;
    const tokenId = assetId;

    if (!address || !tokenId) {
      return;
    }

    const response = await OpenSeaAPI.get('/events', {
      params: {
        limit,
        only_opensea: false,
        asset_contract_address: address,
        token_id: tokenId,
        event_type: parcelTransactionHistoryEventMap[currentTab],
        cursor: refetch ? undefined : nextCursor,
      },
    });

    const result: ParcelTransactionHistory[] = parseResponseAsParcelTransactionHistories(currentTab, response);

    return {
      result,
      refetch,
      nextCursor: response.data?.next || null,
    };
  },
);

export const useParcelTransactionHistorySliceSelector = <T>(
  func: (state: RootState['parcelTransactionHistory']) => T,
) => useSelector((state: RootState) => func(state.parcelTransactionHistory));

export const parcelTransactionHistorySlice = createSlice({
  name: 'ParcelTransactionHistory',
  initialState,
  reducers: {
    changeTab: (state, { payload: tab }) => {
      state.currentTab = tab;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParcelTransactionHistory.pending, (state) => {
        state.fetchCalled = true;
        state.fetching = true;
      })
      .addCase(fetchParcelTransactionHistory.fulfilled, (state, action) => {
        state.fetching = false;
        state.nextCursor = action.payload?.nextCursor;
        if (action.payload?.refetch) {
          state.result = action.payload?.result || [];
        } else {
          state.result = state.result.concat(action.payload?.result || []);
        }
      })
      .addCase(fetchParcelTransactionHistory.rejected, (state) => {
        state.fetching = false;
      });
  },
});

export const parcelTransactionHistory = parcelTransactionHistorySlice.reducer;
