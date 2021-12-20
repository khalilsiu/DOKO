import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import metaverses from '../../constants/metaverses';
import ContractServiceAPI from '../../libs/contract-service-api';

interface Summary {
  isAvailable: boolean;
  traits: {
    floorPrice: number;
  }[];
}
// asset.traits[traitType: x, value: y]
// summary.traits.floorPrice: [a,b,c]
export interface CollectionSummary {
  // TODO: add type back
  // no count needed, can be inferred from nfts.length
  // price should be another domain not User
  summaries: Summary[];
  isLoading: boolean;
}

const initialState: CollectionSummary = {
  summaries: metaverses.map((metaverse) => ({
    isAvailable: true,
    traits: metaverse.traits.map(() => ({
      floorPrice: 0,
    })),
  })),
  isLoading: false,
};

export const fetchCollectionSummary = createAsyncThunk(
  'CollectionSummary/fetchCollectionSummary',
  async () => {
    const metaverseRequests = metaverses.map((metaverse) => {
      if (!metaverse.traits.length) {
        return [
          ContractServiceAPI.post('asset/floor-price', {
            address: metaverse.primaryAddress,
          }),
        ];
      }
      return metaverse.traits.map((trait) => ContractServiceAPI.post('asset/floor-price', {
        address: metaverse.primaryAddress,
        traits: trait,
      }));
    });

    const metaverseResponses = await Promise.all(
      // eslint-disable-next-line max-len
      metaverseRequests.map((requests) => Promise.all(requests.map((request) => request.then((res) => res.data)))),
    );

    const floorPrices = metaverseResponses.map((responses) => responses.map((response) => {
      const { price, payment_token } = response;
      const priceInToken = parseFloat(price);
      const ethPrice = parseFloat(payment_token.eth_price);
      return (priceInToken * ethPrice) / 10 ** payment_token.decimals;
    }));

    return metaverses.map((_, index) => ({
      traits: floorPrices[index],
    }));
  },
);

const collectionSummarySlice = createSlice({
  name: 'CollectionSummary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollectionSummary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCollectionSummary.fulfilled, (state, action) => {
        state.summaries = state.summaries.map((summary, index) => ({
          ...summary,
          // fetchCollectionSummary takes care of all summary related calls
          // to be extended
          // floorPrice: action.payload[index].floorPrice,
        }));
        state.isLoading = false;
      });
  },
});

// export const { } = collectionSummarySlice.actions;

export const collectionSummary = collectionSummarySlice.reducer;
