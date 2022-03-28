import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import metaverses from 'constants/metaverses';
import ContractServiceAPI from 'libs/contract-service-api';
import { preprocessAssetFromServer } from 'store/assets/listingsSlice';
import { AddressOwnership, Asset } from 'store/profile/profileOwnershipSlice';
import { fetchMetaverseAssets } from 'store/summary/utils';

const placeholder = Array(metaverses.length)
  .fill(null)
  .map(() => []);

const initialState: AddressOwnership = {
  assets: placeholder.slice(),
  leasedAssets: placeholder.slice(),
  rentedAssets: placeholder.slice(),
  address: '',
};

export const fetchAddressOwnership = createAsyncThunk(
  'AddressOwnership/fetchAddressOwnership',
  async (address: string) => {
    const assets = await fetchMetaverseAssets(address);
    const leasedAssets: Asset[][] = [];
    const rentedAssets: Asset[][] = [];
    for (const metaverse of metaverses) {
      const contractAddresses = metaverse.addresses.flat();
      const metaverseLeasedAssets: Asset[] = [];
      const metaverseRentedAssets: Asset[] = [];
      for (const contractAddress of contractAddresses) {
        const contractLeasedAssets: Asset[] = await ContractServiceAPI.getLeasedAssets({
          lessor: address,
          contractAddress,
        });
        const contractRentedAssets: Asset[] = await ContractServiceAPI.getLeasedAssets({
          lessee: address,
          contractAddress,
        });
        metaverseLeasedAssets.push(...contractLeasedAssets.map(preprocessAssetFromServer));
        metaverseRentedAssets.push(...contractRentedAssets.map(preprocessAssetFromServer));
      }
      leasedAssets.push(metaverseLeasedAssets);
      rentedAssets.push(metaverseRentedAssets);
    }
    return {
      address,
      assets,
      leasedAssets,
      rentedAssets,
    };
  },
);

const addressOwnershipSlice = createSlice({
  name: 'AddressOwnership',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAddressOwnership.fulfilled, (_, action) => {
      return action.payload;
    });
  },
});

// export const { getUserOwnership } = addressOwnershipSlice.actions;

export const addressOwnership = addressOwnershipSlice.reducer;
