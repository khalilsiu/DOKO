import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ContractServiceAPI from 'libs/contract-service-api';
import { Lease } from 'store/lease/leasesSlice';
import { fetchMetaverseAssets } from 'store/summary/utils';

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
  owner: string;
  creatorAddress: string;
  assetContract: {
    address: string;
  };
  lease?: Lease;
  traits: Trait[];
  metaverseName: string;
  collection: string;
  tokenStandard: string;
  slug: string;
  externalLink: string;
  lastPurchasePriceEth: number;
  lastPurchasePriceUsd: number;
  floorPriceInUsd: number;
  floorPriceInEth: number;
}

export interface AddressOwnership {
  // TODO: add type back
  // no count needed, can be inferred from nfts.length
  // price should be another domain not User
  assets: Asset[][];
  leasedAssets: Asset[][];
  rentedAssets: Asset[][];
  address: string;
}

const initialState: AddressOwnership[] = [];

export const fetchProfileOwnership = createAsyncThunk(
  'ProfileOwnership/fetchProfileOwnership',
  async (addresses: string[]): Promise<AddressOwnership[]> => {
    const profile: AddressOwnership[] = [];
    for (const address of addresses) {
      const assets = await fetchMetaverseAssets(address);
      const leasedAssets = await ContractServiceAPI.getLeasedAssets({ lessor: address });
      const rentedAssets = await ContractServiceAPI.getLeasedAssets({ lessee: address });
      profile.push({
        assets,
        leasedAssets,
        rentedAssets,
        address,
      });
    }
    return profile;
  },
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
