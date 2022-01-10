import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pick } from 'lodash';
import metaverses from '../../constants/metaverses';
import OpenSeaAPI from '../../libs/opensea-api';
import { camelize } from '../../utils/utils';

export interface Trait {
  traitType: string;
  value: string;
}

export interface Asset {
  floorPrice: number;
  id: string;
  tokenId: string;
  imageUrl: string;
  imagePreviewUrl: string;
  imageThumbnailUrl: string;
  name: string;
  assetContract: {
    address: string;
  };
  traits: Trait[];
}

export interface AddressOwnership {
  // TODO: add type back
  // no count needed, can be inferred from nfts.length
  // price should be another domain not User
  assets: Asset[][];
  address: string;
}

const initialState: AddressOwnership[] = [];

export const preprocess = (asset: any): Asset => {
  const picked = pick(asset, [
    'id',
    'token_id',
    'image_url',
    'image_preview_url',
    'image_thumbnail_url',
    'image_original_url',
    'name',
    'asset_contract',
    'traits',
  ]);
  picked.asset_contract = pick(picked.asset_contract, ['address']);
  picked.traits = picked.traits.map((trait) => pick(trait, ['trait_type', 'value']));
  return camelize(picked);
};

export const fetchAssets = async (address: string) => {
  let assetsFromResponse: any[] = [''];
  let offset = 0;
  const assets: any[] = [];
  const nfts: Asset[][] = Array(metaverses.length)
    .fill(null)
    .map(() => []);
  while (assetsFromResponse.length) {
    const params = new URLSearchParams();
    params.append('limit', '50');
    params.append('owner', address);
    params.append('offset', offset.toString());
    metaverses
      .flatMap((metaverse) => metaverse.addresses)
      .forEach((contractAddress) => {
        params.append('asset_contract_addresses', contractAddress);
      });

    const response = await OpenSeaAPI.get('/assets', { params });
    assetsFromResponse = response.data.assets;
    assets.push(...assetsFromResponse);
    offset += 50;
  }

  assets.forEach((asset) => {
    if (!asset.asset_contract) {
      return;
    }
    metaverses.forEach((metaverse, index) => {
      // no differentiation within same collection
      if (metaverse.addresses.includes(asset.asset_contract.address)) {
        nfts[index].push(preprocess(asset));
      }
    });
  });
  return nfts;
};

export const fetchProfileOwnership = createAsyncThunk(
  'ProfileOwnership/fetchProfileOwnership',
  async (addresses: string[]): Promise<AddressOwnership[]> => {
    console.log('xcvxcvxcv', await fetchAssets('0x274af2158e20afabd0524bd01140748edb1eb47e'));
    return [
      {
        address: '0x274af2158e20afabd0524bd01140748edb1eb47e',
        assets: await fetchAssets('0x274af2158e20afabd0524bd01140748edb1eb47e'),
      },
    ];
  },
);

const profileOwnershipSlice = createSlice({
  name: 'ProfileOwnership',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProfileOwnership.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

// export const { getUserOwnership } = profileOwnershipSlice.actions;

export const profileOwnership = profileOwnershipSlice.reducer;