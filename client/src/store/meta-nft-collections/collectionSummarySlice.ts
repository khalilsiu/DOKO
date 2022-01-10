import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import metaverses from '../../constants/metaverses';
import ContractServiceAPI from '../../libs/contract-service-api';

export interface MetaverseSummary {
  traits: number[];
}

const initialState: MetaverseSummary[] = metaverses.map((metaverse) => ({
  traits: metaverse.traits.map(() => 0),
}));

export const fetchCollectionSummary = createAsyncThunk(
  'CollectionSummary/fetchCollectionSummary',
  async () => {
    const metaverseRequests = metaverses.map((metaverse) =>
      metaverse.traits.map((trait) =>
        ContractServiceAPI.post('asset/floor-price', {
          address: metaverse.primaryAddress,
          traits: trait,
        }),
      ),
    );

    const metaverseResponses = await Promise.all(
      metaverseRequests.map((requests) =>
        Promise.all(
          requests.map((request) =>
            request
              .then((res) => res.data)
              .catch((err) => {
                if (err.response.status === 404) {
                  return {
                    price: 0,
                    payment_token: {
                      address: '0x0000000000000000000000000000000000000000',
                      decimals: 18,
                      eth_price: '1.000000000000000',
                      symbol: 'ETH',
                    },
                  };
                }
                throw err;
              }),
          ),
        ),
      ),
    );

    const floorPrices = metaverseResponses.map((responses) =>
      responses.map((response) => {
        const { price, payment_token } = response;
        const priceInToken = parseFloat(price);
        const ethPrice = parseFloat(payment_token.eth_price);
        return (priceInToken * ethPrice) / 10 ** payment_token.decimals;
      }),
    );

    return floorPrices;
  },
);

const collectionSummarySlice = createSlice({
  name: 'CollectionSummary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // .addCase(fetchCollectionSummary.pending, (state) => {
      //   state.isLoading = true;
      // })
      .addCase(fetchCollectionSummary.fulfilled, (state, action) =>
        state.map((metaversesummary, index) => ({
          ...metaversesummary,
          // fetchCollectionSummary takes care of all metaversesummary related calls
          // to be extended
          traits: action.payload[index],
        })),
      );
  },
});

// export const { } = collectionSummarySlice.actions;

export const collectionSummary = collectionSummarySlice.reducer;
