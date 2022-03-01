import { minimizeAddress } from 'libs/utils';
import { web3 } from 'libs/web3';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import OpenSeaAPI from '../../../libs/opensea-api';

export type ParcelTransactionHistoryCategory = 'sales' | 'bids' | 'transfers';

export interface ParcelTransactionHistory {
  fromAddress: string | null;
  toAddress: string | null;
  price: number | null;
  parcel: string;
  time: string;
}

interface ParcelTransactionHistoryStore {
  address: string | null;
  tokenId: string | null;
  fetching: boolean;
  currentTab: ParcelTransactionHistoryCategory;
  offset: number;
  limit: number;
  currentPage: number;
  rowsPerPage: number;
  result: ParcelTransactionHistory[];
  setCurrentPage: (currentPage: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  changeTab: (tab: ParcelTransactionHistoryCategory) => void;
  fetch: (contractAddress?: string, assetId?: string) => void;
}

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
    return address ? minimizeAddress(address) : null;
  };

  const formatPrice = (price: string | null) => {
    return price ? Number(Number.parseFloat(web3.utils.fromWei(price, 'ether')).toFixed(2)) : null;
  };

  return response.data.asset_events.map((assetEvent) => {
    switch (currentTab) {
      case 'sales':
        return {
          fromAddress: formatAddress(assetEvent?.seller?.address),
          toAddress: formatAddress(assetEvent?.winner_account?.address),
          price: formatPrice(assetEvent?.total_price),
          parcel: assetEvent?.asset?.name || null,
          time: assetEvent?.created_date,
        };
      case 'bids':
        return {
          fromAddress: formatAddress(assetEvent?.from_account?.address),
          toAddress: null,
          price: formatPrice(assetEvent?.bid_amount),
          parcel: assetEvent?.asset?.name || null,
          time: assetEvent?.created_date,
        };
      case 'transfers':
        return {
          fromAddress: formatAddress(assetEvent?.from_account?.address),
          toAddress: formatAddress(assetEvent?.to_account?.address),
          price: formatPrice(assetEvent?.bid_amount),
          parcel: assetEvent?.asset?.name || null,
          time: assetEvent?.created_date,
        };
    }
  });
};

export const useParcelTransactionHistoryStore = create<ParcelTransactionHistoryStore>(
  persist(
    (set, get) => ({
      currentTab: 'sales',
      offset: 0,
      limit: 100,
      currentPage: 0,
      rowsPerPage: 5,
      result: [],
      fetching: false,
      address: null,
      tokenId: null,
      setCurrentPage: (currentPage: number) => {
        set({ currentPage });
      },
      setRowsPerPage: (rowsPerPage: number) => {
        set({ rowsPerPage });
      },
      changeTab: (tab: ParcelTransactionHistoryCategory) => {
        set({ currentTab: tab });
        get().fetch();
      },
      async fetch(contractAddress, assetId) {
        try {
          const { offset, limit, currentTab } = get();
          const address = contractAddress || get().address;
          const tokenId = assetId || get().tokenId;

          if (!address || !tokenId) {
            return;
          }

          set({ fetching: true });

          const response = await OpenSeaAPI.get('/events', {
            params: {
              offset,
              limit,
              only_opensea: false,
              asset_contract_address: address,
              token_id: tokenId,
              event_type: parcelTransactionHistoryEventMap[currentTab],
            },
          });

          const result: ParcelTransactionHistory[] = parseResponseAsParcelTransactionHistories(
            currentTab,
            response,
          );

          set({
            result,
            fetching: false,
            currentPage: 0,
            address: address,
            tokenId: tokenId,
          });
        } catch (error) {
          console.error(error);
          set({ fetching: false });
        }
      },
    }),
    { name: 'ParcelTransactionHistory' },
  ),
);
