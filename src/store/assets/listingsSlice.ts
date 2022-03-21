import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ContractServiceAPI, { SortOption } from '../../libs/contract-service-api';
import { camelize, getCoordinates } from '../../utils/utils';
import { pick } from 'lodash';
import metaverses from '../../constants/metaverses';
import { Asset } from 'store/profile/profileOwnershipSlice';

const initialState: Asset[][][] = [];

interface IGetLstings {
  filter?: {
    lessor?: string;
    lessee?: string;
  };
  sortOptions?: SortOption[];
}

const getListingsFromServer = async ({ filter, sortOptions }: IGetLstings) => {
  const listings: Asset[][][] = [];

  for (let i = 0; i < metaverses.length; i++) {
    const contractsAssets = await Promise.all(
      metaverses[i].addresses.map((address) => {
        let sortOption: SortOption[] = [];
        if (sortOptions) {
          sortOption = [sortOptions[i]];
        }
        return ContractServiceAPI.getLeasedAssets({
          ...filter,
          contractAddress: address,
          isOpen: true,
          sort: sortOption,
        }).catch((err) => {
          if (err.response.status === 404) {
            return [];
          }
        });
      }),
    );

    listings.push(
      contractsAssets.map((contractAsset) => {
        return contractAsset.map((asset) => ({
          ...preprocessAssetFromServer(asset),
        }));
      }),
    );
  }
  return listings;
};

export const getListings = createAsyncThunk('listings/getListings', async (payload: IGetLstings) =>
  getListingsFromServer(payload),
);

export const preprocessAssetFromServer = (assetFromServer: any): Asset => {
  const picked = pick(assetFromServer, [
    'id',
    'token_id',
    'image_url',
    'image_preview_url',
    'image_thumbnail_url',
    'image_original_url',
    'name',
    'address',
    'traits',
    'description',
    'lease',
    'asset_contract',
    'owner',
  ]);
  picked.asset_contract = { address: picked.address };
  delete picked.address;
  picked.traits = picked.traits.map((trait) => pick(trait, ['trait_type', 'value']));
  picked.owner = pick(picked.owner, ['address']).address;
  const metaverse = metaverses.find((metaverse) => metaverse.addresses.includes(picked.asset_contract.address));
  const coordinates: L.LatLngExpression = getCoordinates(metaverse ? metaverse.label : '', picked);
  return camelize({ ...picked, coordinates });
};

const listingsSlice = createSlice({
  name: 'Listings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListings.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

// export const { getUserOwnership } = listings.actions;

export const listings = listingsSlice.reducer;
