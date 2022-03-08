import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import metaverses from 'constants/metaverses';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import ContractServiceAPI from '../../libs/contract-service-api';
import OpenSeaAPI from '../../libs/opensea-api';
import { camelize } from '../../utils/utils';
import { Asset, parsePriceETH, parsePriceUSD, preprocess } from '../summary';
import { preprocessAssetFromServer } from './metaverseAssetsFromServerSlice';

const initialState: Asset = {
  id: '',
  tokenId: '',
  imageUrl: '',
  imageOriginalUrl: '',
  coordinates: [0, 0],
  imagePreviewUrl: '',
  imageThumbnailUrl: '',
  name: '',
  description: '',
  ownerAddress: '',
  creatorAddress: '',
  assetContract: {
    address: '',
  },
  traits: [],
  metaverseName: null,
  collection: null,
  tokenStandard: null,
  slug: null,
  externalLink: null,
  lastPurchasePriceEth: null,
  lastPurchasePriceUsd: null,
  floorPriceUsd: null,
  floorPriceEth: null,
};

interface IGetAsset {
  contractAddress: string;
  tokenId: string;
}

export const useAssetSliceSelector = <T>(func: (state: RootState['asset']) => T) =>
  useSelector((state: RootState) => func(state.asset));

const fetchMetaverseFloorPrice = async (asset: Asset): Promise<[number | null, number | null]> => {
  try {
    const metaverse = metaverses.find((metaverse) => asset.slug === metaverse.slug);
    if (!metaverse) {
      return [0, 0];
    }

    const traits = asset.traits?.length ? asset.traits : [];

    const lookupTraits = traits.filter((trait) =>
      (metaverse.primaryTraitTypes as string[]).includes(trait.traitType),
    );

    const traitFilter = lookupTraits.map((trait) => ({
      traitType: trait.traitType,
      value: trait.value,
      operator: '=',
    }));

    const response = await ContractServiceAPI.getAssetFloorPrice(
      metaverse.primaryAddress,
      traitFilter,
    );

    let floorPriceETH = parsePriceETH(response.price, response.payment_token);
    let floorPriceUSD = parsePriceUSD(response.price, response.payment_token);

    if (asset.assetContract.address === '0x959e104e1a4db6317fa58f8295f586e1a978c297') {
      const sizeTrait = asset.traits.find((trait) => trait.traitType === 'Size');
      const size = parseInt((sizeTrait && sizeTrait.value) || '1', 10);
      floorPriceETH *= size;
      floorPriceUSD *= size;
    }

    return [floorPriceETH, floorPriceUSD];
  } catch (e) {
    return [null, null];
  }
};
const fetchNFTOpensea = async (address: string, id: string) =>
  OpenSeaAPI.get(`/asset/${address}/${id}`);

export const getAssetFromOpensea = createAsyncThunk(
  'Asset/getAssetFromOpensea',
  async ({ contractAddress, tokenId }: IGetAsset) => {
    try {
      const response = await fetchNFTOpensea(contractAddress, tokenId);
      const asset = preprocess(response.data);
      const lease = await ContractServiceAPI.getLease({ contractAddress, tokenId });
      const [floorPriceETH, floorPriceUSD] = await fetchMetaverseFloorPrice(asset);

      return camelize({ ...asset, lease, floorPriceETH, floorPriceUSD });
    } catch (e) {
      console.error(e);
    }
  },
);

export const getAssetFromServer = createAsyncThunk(
  'Asset/getAssetFromServer',
  async (payload: IGetAsset) => {
    const leaseWithAsset = await ContractServiceAPI.getLease(payload);
    return preprocessAssetFromServer(leaseWithAsset);
  },
);

const assetSlice = createSlice({
  name: 'Asset',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAssetFromOpensea.fulfilled, (_, action) => {
        return action.payload;
      })
      .addCase(getAssetFromServer.fulfilled, (_, action) => {
        return action.payload;
      });
  },
});

// export const { getUserOwnership } = assetSlice.actions;

export const asset = assetSlice.reducer;
