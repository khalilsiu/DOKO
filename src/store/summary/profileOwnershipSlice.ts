import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Lease } from '../lease/metaverseLeasesSlice';
import { fetchAssets } from './utils';

export interface Trait {
  traitType: string;
  value: string;
}

export interface Asset {
  id: string;
  tokenId: string;
  imageUrl: string;
  imageOriginalUrl: string;
  coordinates: L.LatLngExpression;
  imagePreviewUrl: string;
  imageThumbnailUrl: string;
  name: string;
  description: string;
  ownerAddress: string;
  creatorAddress: string;
  assetContract: {
    address: string;
  };
  lease?: Lease;
  traits: Trait[];
  metaverseName: string | null;
  collection: string | null;
  tokenStandard: string | null;
  slug: string | null;
  externalLink: string | null;
  lastPurchasePriceEth: number | null;
  lastPurchasePriceUsd: number | null;
  floorPriceUsd: number | null;
  floorPriceEth: number | null;
}

export interface AddressOwnership {
  // TODO: add type back
  // no count needed, can be inferred from nfts.length
  // price should be another domain not User
  assets: Asset[][];
  address: string;
}

const initialState: AddressOwnership[] = [];

export const fetchProfileOwnership = createAsyncThunk(
  'ProfileOwnership/fetchProfileOwnership',
  async (addresses: string[]): Promise<AddressOwnership[]> =>
    Promise.all(
      addresses.map(async (address) => ({
        address,
        assets: await fetchAssets(address),
      })),
    ),
);

const profileOwnershipSlice = createSlice({
  name: 'ProfileOwnership',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProfileOwnership.fulfilled, (_, action) => {
      return action.payload;
    });
  },
});

// export const { getUserOwnership } = profileOwnershipSlice.actions;

export const profileOwnership = profileOwnershipSlice.reducer;
