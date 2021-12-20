import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import metaverses from '../../constants/metaverses';
import ContractServiceAPI from '../../libs/contract-service-api';

interface Summary {
  traits: number[];
}
export interface CollectionSummary {
  // TODO: add type back
  summaries: Summary[];
  isLoading: boolean;
}

const initialState: CollectionSummary = {
  summaries: metaverses.map((metaverse) => ({
    traits: metaverse.traits.map(() => 0),
  })),
  isLoading: false,
};

export const fetchCollectionSummary = createAsyncThunk(
  'CollectionSummary/fetchCollectionSummary',
  async () => {
    const metaverseRequests = metaverses.map((metaverse) => metaverse.traits.map((trait) => ContractServiceAPI.post('asset/floor-price', {
      address: metaverse.primaryAddress,
      traits: trait,
    })));

    const metaverseResponses = await Promise.all(
      // eslint-disable-next-line max-len
      metaverseRequests.map((requests) => Promise.all(requests.map((request) => request.then((res) => res.data).catch((err) => {
        if (err.response.status === 404) {
          return { price: 0,
            payment_token: { address: '0x0000000000000000000000000000000000000000',
              decimals: 18,
              eth_price: '1.000000000000000',
              symbol: 'ETH' } };
        }
        throw err;
      })))),
    );

    const floorPrices = metaverseResponses.map((responses) => responses.map((response) => {
      const { price, payment_token } = response;
      const priceInToken = parseFloat(price);
      const ethPrice = parseFloat(payment_token.eth_price);
      return (priceInToken * ethPrice) / 10 ** payment_token.decimals;
    }));

    return floorPrices;
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
          traits: action.payload[index],
        }));
        state.isLoading = false;
      });
  },
});

// export const { } = collectionSummarySlice.actions;

export const collectionSummary = collectionSummarySlice.reducer;
