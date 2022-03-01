import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import metaverses from '../../constants/metaverses';
import ContractServiceAPI from '../../libs/contract-service-api';

export interface MetaverseSummary {
  traits: number[];
}

const initialState: MetaverseSummary[] = metaverses.map((metaverse) => ({
  traits: metaverse.traits.map(() => 0),
}));

export const parsePriceETH = (price: string, payment_token: any): number => {
  const priceInToken = parseFloat(price);
  const ethPrice = parseFloat(payment_token.eth_price);
  return Number(
    parseFloat(`${(priceInToken * ethPrice) / 10 ** payment_token.decimals}`).toFixed(3),
  );
};

export const parsePriceUSD = (price: string, payment_token: any): number => {
  return Number(
    parseFloat(`${(payment_token?.usd_price ?? 0) * parsePriceETH(price, payment_token)}`).toFixed(
      3,
    ),
  );
};

export const fetchCollectionSummary = createAsyncThunk(
  'CollectionSummary/fetchCollectionSummary',
  async () => {
    const metaverseRequests = metaverses.map((metaverse) =>
      metaverse.traits.map((traits) =>
        ContractServiceAPI.getAssetFloorPrice(metaverse.primaryAddress, traits),
      ),
    );

    const metaverseResponses = await Promise.all(
      metaverseRequests.map((requests) => Promise.all(requests)),
    );

    const floorPrices = metaverseResponses.map((responses) =>
      responses.map((response) => {
        const { price, payment_token } = response;
        return parsePriceETH(price, payment_token);
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
