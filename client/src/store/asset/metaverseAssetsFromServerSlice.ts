import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ContractServiceAPI, { SortOption } from '../../libs/contract-service-api';
import { camelize, getCoordinates } from '../../utils/utils';
import { pick } from 'lodash';
import metaverses from '../../constants/metaverses';
import { Asset } from 'store/summary/profileOwnershipSlice';

const initialState: Asset[][][] = [];

export const getMetaverseAssetsFromServer = createAsyncThunk(
  'MetaverseAssets/getMetaverseAssetsFromServer',
  async (sortOptions: SortOption[]) => {
    const metavereseAssets: Asset[][][] = [];

    for (let i = 0; i < metaverses.length; i++) {
      const contractsAssets = await Promise.all(
        metaverses[i].addresses.map((address) =>
          ContractServiceAPI.getLeases({
            contractAddress: address,
            isOpen: true,
            sort: [sortOptions[i]],
          }).catch((err) => {
            if (err.response.status === 404) {
              return [];
            }
          }),
        ),
      );

      metavereseAssets.push(
        contractsAssets.map((contractAsset) => {
          return contractAsset.map((asset) => ({
            ...preprocessAssetFromServer(asset),
          }));
        }),
      );
    }
    return metavereseAssets;
  },
);

export const preprocessAssetFromServer = (assetFromServer: any) => {
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
  const metaverse = metaverses.find((metaverse) =>
    metaverse.addresses.includes(picked.asset_contract.address),
  );
  const coordinates: L.LatLngExpression = getCoordinates(metaverse ? metaverse.label : '', picked);
  return camelize({ ...picked, coordinates });
};

const metaverseAssetsSlice = createSlice({
  name: 'MetaverseAssets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMetaverseAssetsFromServer.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

// export const { getUserOwnership } = metaverseAssets.actions;

export const metaverseAssets = metaverseAssetsSlice.reducer;
